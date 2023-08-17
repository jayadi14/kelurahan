import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsReceiptDetailEditDialogComponent } from '@features/goods-receipt/components/goods-receipt-detail-edit-dialog/goods-receipt-detail-edit-dialog.component';
import { GoodsReceipt } from '@features/goods-receipt/interfaces/goods-receipt';
import { GoodsReceiptService } from '@features/goods-receipt/services/goods-receipt.service';
import { PurchaseInvoiceService } from '@features/purchase-invoice/services/purchase-invoice.service';
import { PurchaseOrder } from '@features/purchase-order/interfaces/purchase-order';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import {
  faArrowRight,
  faCheck,
  faChevronDown,
  faEye,
  faPencil,
  faPlus,
  faRefresh,
  faSave,
  faTimes,
  faTrash,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-goods-receipt-view',
  templateUrl: './goods-receipt-view.component.html',
  styleUrls: ['./goods-receipt-view.component.css'],
})
export class GoodsReceiptViewComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowRight = faArrowRight;

  purchaseNoteType: any = [
    {
      id: 0,
      name: 'Debit',
    },
    {
      id: 1,
      name: 'Credit',
    },
  ];

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      hidden: true,
      action: () => {
        this.submit();
      },
    },
    {
      label: 'Complete',
      hidden: true,
      icon: faCheck,
      action: () => {
        this.setGoodsReceiptAsComplete();
      },
    },
    {
      label: 'Cancel',
      hidden: true,
      icon: faX,
      action: () => {
        this.setGoodsReceiptAsCancel();
      },
    },
    {
      label: 'Delete',
      hidden: true,
      icon: faTrash,
      action: () => {
        this.delete();
      },
    },
  ];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {
        this.refresh();
      },
    },
  ];
  loading = false;
  goodsReceiptId: any;
  goodsReceipt!: GoodsReceipt;
  goodsReceiptForm: FormGroup;

  constructor(
    private layoutService: LayoutService,
    private goodsReceiptService: GoodsReceiptService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router,
    private route: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseInvoiceService: PurchaseInvoiceService
  ) {
    this.goodsReceiptId = String(this.route.snapshot.paramMap.get('id'));

    this.goodsReceiptForm = new FormGroup({
      purchase_invoice: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      note: new FormControl(null),
      warehouse: new FormControl(null, Validators.required),
      goods_receipt_details: new FormArray([]),
    });
  }
  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}
  generateActionButtons() {
    this.actionButtons.forEach((actionButton) => {
      actionButton.hidden = true;
    });
    switch (this.goodsReceipt.status) {
      case 0: // draft
        this.actionButtons[0].hidden = false;
        this.actionButtons[1].hidden = false;
        this.actionButtons[2].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      case 1: // complete
        break;
      case 2: // cancelled
        break;
      default:
        break;
    }
  }
  generateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Goods Receipt (${this.goodsReceipt.status_name})`,
      icon: '',
      showHeader: true,
    });
  }

  loadData() {
    this.loading = true;
    this.goodsReceiptService
      .getGoodsReceipt(this.goodsReceiptId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.goodsReceipt = res.data;
        this.generateActionButtons();
        this.generateHeader();

        this.goodsReceiptForm.patchValue({
          purchase_invoice: this.goodsReceipt.purchase_invoice,
          date: this.goodsReceipt.date,
          note: this.goodsReceipt.note,
          warehouse: this.goodsReceipt.warehouse,
        });
        this.loadPurchaseOrder(
          this.goodsReceipt.purchase_invoice.purchase_order_id
        );
        this.goodsReceipt.goods_receipt_details.forEach((data: any) => {
          this.goodsReceiptDetails.push(this.generateGoodsReceiptDetails(data));
        });
      });
  }

  get goodsReceiptDetails(): FormArray {
    return this.goodsReceiptForm.get('goods_receipt_details') as FormArray;
  }

  generateGoodsReceiptDetails(goodsReceiptDetails: any): FormGroup {
    return new FormGroup({
      id: new FormControl(goodsReceiptDetails.id),
      product: new FormControl(goodsReceiptDetails.product),
      quantity: new FormControl(goodsReceiptDetails.quantity),
    });
  }

  purchaseOrder!: PurchaseOrder;
  warehouses: Warehouse[] = [];
  loadPurchaseOrder(purchaseOrderId: any) {
    forkJoin([
      this.purchaseOrderService.getPurchaseOrder(purchaseOrderId),
      this.purchaseInvoiceService.getPurchaseInvoice(
        this.goodsReceiptForm.value.purchase_invoice.id
      ),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([purchaseOrder, purchaseInvoice]: any) => {
        this.purchaseOrder = purchaseOrder.data;
        this.goodsReceiptForm.patchValue({
          purchase_invoice: purchaseInvoice.data,
        });
        const warehouses: Warehouse[] = [];

        let allowedPOD =
          this.goodsReceiptForm.value.purchase_invoice.purchase_invoice_details.map(
            (value: any) => value.product.id
          );

        this.purchaseOrder.purchase_order_details =
          this.purchaseOrder.purchase_order_details.filter((value) => {
            return allowedPOD.includes(value.product.id);
          });

        this.purchaseOrder.purchase_order_details.forEach((value: any) => {
          value.purchase_order_warehouses.forEach((detail: any) => {
            warehouses.push(detail.warehouse);
          });
        });

        const key = 'id';
        this.warehouses = [
          ...new Map(warehouses.map((item) => [item[key], item])).values(),
        ];
      });
  }

  onAddGoodsReceiptDetail() {
    const selectedWarehouse = this.goodsReceiptForm.value.warehouse;
    const allowedPOD = this.purchaseOrder.purchase_order_details.filter(
      (value) =>
        value.purchase_order_warehouses.filter(
          (detail) => detail.warehouse_id === selectedWarehouse.id
        ).length
    );

    const goodsReceiptDetailProducts = this.goodsReceiptDetails.value.map(
      (value: any) => {
        return value.product.id;
      }
    );
    let products: any = allowedPOD.filter(
      (value) => !goodsReceiptDetailProducts.includes(value.product.id)
    );

    products = products.map((value: any) => {
      return { ...value.product };
    });
    // Open Dialog
    const ref = this.dialogService.open(GoodsReceiptDetailEditDialogComponent, {
      data: {
        title: 'Add Goods Receipt Detail',
        goodsReceiptId: this.goodsReceiptId,
        selectedWarehouse: this.goodsReceiptForm.value.warehouse.id,
        allowedPOD: allowedPOD,
        products: products,
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((goodsReceiptDetail) => {
      if (goodsReceiptDetail) {
        this.goodsReceiptDetails.push(
          this.generateGoodsReceiptDetails(goodsReceiptDetail)
        );
      }
    });
  }

  onEditGoodsReceiptDetail(goodsReceiptDetailId: string, index: number) {
    const selectedWarehouse = this.goodsReceiptForm.value.warehouse;
    const allowedPOD = this.purchaseOrder.purchase_order_details.filter(
      (value) =>
        value.purchase_order_warehouses.filter(
          (detail) => detail.warehouse_id === selectedWarehouse.id
        ).length
    );

    const goodsReceiptDetailProducts = this.goodsReceiptDetails.value.map(
      (value: any) => {
        return value.product.id;
      }
    );
    let products: any = allowedPOD.filter(
      (value) => !goodsReceiptDetailProducts.includes(value.product.id)
    );

    products = products.map((value: any) => {
      return { ...value.product };
    });
    // Open Dialog
    const ref = this.dialogService.open(GoodsReceiptDetailEditDialogComponent, {
      data: {
        title: 'Edit Purchase Note Detail',
        goodsReceiptId: this.goodsReceiptId,
        goodsReceiptDetailId: goodsReceiptDetailId,
        selectedWarehouse: this.goodsReceiptForm.value.warehouse.id,
        allowedPOD: allowedPOD,
        products: products,
        goodsReceiptDetail: this.goodsReceiptDetails.value[index],
      },
      showHeader: false,
      contentStyle: {
        padding: '0',
      },
      style: {
        overflow: 'hidden',
      },
      styleClass: 'rounded-sm',
      dismissableMask: true,
      width: '450px',
    });
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.goodsReceiptDetails.controls[index].patchValue(newData);
      }
    });
  }

  onRemoveGoodsReceiptDetail(goodsReceiptDetailId: string, index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.goodsReceiptService
          .deleteGoodsReceiptDetail(this.goodsReceiptId, goodsReceiptDetailId)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Goods Receipt Detail',
                message: res.message,
              });
              this.goodsReceiptDetails.removeAt(index);
            },
            error: (err) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Goods Receipt Detail',
                message: err.message,
              });
            },
          });
      },
    });
  }

  setGoodsReceiptAsComplete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to set this goods receipt as complete ?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.goodsReceiptService
          .setStatusAsComplete(this.goodsReceiptId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[1].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Goods Receipt',
                message: res.message,
              });
              this.goodsReceipt.status_name = res.data.status_name;
              this.goodsReceipt.status = res.data.status;
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err) => {
              this.actionButtons[1].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Goods Receipt',
                message: err.message,
              });
            },
          });
      },
    });
  }

  setGoodsReceiptAsCancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to set this goods receipt as cancel ?',
      accept: () => {
        this.actionButtons[2].loading = true;
        this.goodsReceiptService
          .setStatusAsCancel(this.goodsReceiptId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[2].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Goods Receipt',
                message: res.message,
              });
              this.goodsReceipt.status_name = res.data.status_name;
              this.goodsReceipt.status = res.data.status;
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err) => {
              this.actionButtons[2].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Goods Receipt',
                message: err.message,
              });
            },
          });
      },
    });
  }

  delete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this goods receipt ?',
      accept: () => {
        this.actionButtons[3].loading = true;
        this.goodsReceiptService
          .deleteGoodsReceipt(this.goodsReceiptId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[3].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Goods Receipt',
                message: res.message,
              });
              this.router.navigate(['/goods-receipt/list']);
            },
            error: (err) => {
              this.actionButtons[3].loading = false;
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Goods Receipt',
                message: err.message,
              });
            },
          });
      },
    });
  }

  submit() {
    this.actionButtons[0].loading = true;
    let bodyReqForm: FormGroup;
    bodyReqForm = new FormGroup({
      date: new FormControl(this.goodsReceiptForm.value.date),
      note: new FormControl(this.goodsReceiptForm.value.note),
    });

    this.goodsReceiptService
      .updateGoodsReceipt(this.goodsReceiptId, bodyReqForm.value)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Goods Receipt',
            message: res.message,
          });
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Goods Receipt',
            message: err.message,
          });
        },
      });
  }
  refresh() {
    this.goodsReceiptForm.removeControl('goods_receipt_details');
    this.goodsReceiptForm.addControl(
      'goods_receipt_details',
      new FormArray([])
    );
    this.loadData();
  }
}
