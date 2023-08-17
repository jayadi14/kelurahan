import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoodsReceiptService } from '@features/goods-receipt/services/goods-receipt.service';
import { faArrowRight, faChevronDown, faEye, faPencil, faPlus, faRefresh, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { Router } from '@angular/router';
import { PurchaseInvoiceSelectDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-select-dialog/purchase-invoice-select-dialog.component';
import { GoodsReceiptDetailAddDialogComponent } from '@features/goods-receipt/components/goods-receipt-detail-add-dialog/goods-receipt-detail-add-dialog.component';
import { WarehouseSelectDialogComponent } from '@features/warehouse/components/warehouse-select-dialog/warehouse-select-dialog.component';
import { PurchaseInvoiceDetailSelectDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-select-dialog/purchase-invoice-detail-select-dialog.component';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { Warehouse } from '@features/warehouse/interfaces/warehouse.interface';
import { PurchaseOrder } from '@features/purchase-order/interfaces/purchase-order';
import { PurchaseInvoiceService } from '@features/purchase-invoice/services/purchase-invoice.service';

@Component({
  selector: 'app-goods-receipt-add',
  templateUrl: './goods-receipt-add.component.html',
  styleUrls: ['./goods-receipt-add.component.css']
})
export class GoodsReceiptAddComponent {
  private destroy$: any = new Subject();
    // Icons
    faTimes = faTimes
    faChevronDown = faChevronDown
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
        action: () => {
          this.submit();
        },
      },
    ];

  loading = false
  goodsReceiptForm: FormGroup;

  constructor(
    private layoutService: LayoutService,
    private goodsReceiptService: GoodsReceiptService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private fcToastService: FcToastService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router,
  ){
    this.layoutService.setHeaderConfig({
      title: 'Add Goods Receipt',
      icon: '',
      showHeader: true,
    });
    this.goodsReceiptForm = new FormGroup({
      purchase_invoice: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      note: new FormControl(null),
      warehouse: new FormControl(null, Validators.required),
      goods_receipt_details: new FormArray([]),
    });
  }
  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  get goodReceiptDetails(): FormArray {
    return this.goodsReceiptForm.get(
      'goods_receipt_details'
    ) as FormArray;
  }

  generateGoodsReceiptDetails(goodsReceiptDetails: any): FormGroup {
    return new FormGroup({
      product: new FormControl(
        goodsReceiptDetails.product
      ),
      quantity: new FormControl(
        goodsReceiptDetails.quantity
      ),
    });
  }

  removePurchaseInvoice() {
    this.goodsReceiptForm.controls['purchase_invoice'].setValue('');
    this.goodsReceiptForm.controls['warehouse'].setValue(null);
    this.goodsReceiptForm.removeControl('goods_receipt_details');
    this.goodsReceiptForm.addControl('goods_receipt_details', new FormArray([]));
  }

  onSelectPurchaseInvoice() {
    const ref = this.dialogService.open(PurchaseInvoiceSelectDialogComponent, {
      data: {
        title: 'Select Purchase Invoice',
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
    ref.onClose.subscribe((purchaseInvoice) => {
      if (purchaseInvoice) {
        this.goodsReceiptForm.controls['purchase_invoice'].setValue(
          purchaseInvoice
        );
        this.loadPurchaseOrder(purchaseInvoice.purchase_order_id)
      }
    });
  }

  purchaseOrder!: PurchaseOrder
  warehouses: Warehouse[] = [];
  loadPurchaseOrder(purchaseOrderId: any){
    forkJoin([
      this.purchaseOrderService.getPurchaseOrder(purchaseOrderId),
      this.purchaseInvoiceService.getPurchaseInvoice(this.goodsReceiptForm.value.purchase_invoice.id)
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([purchaseOrder,purchaseInvoice]: any) => {
         this.purchaseOrder = purchaseOrder.data
         this.goodsReceiptForm.patchValue({
          purchase_invoice: purchaseInvoice.data,
         })
        const warehouses: Warehouse[] = [];

        let allowedPOD = this.goodsReceiptForm.value.purchase_invoice.purchase_invoice_details.map(
          (value: any) => value.product.id
        );

        this.purchaseOrder.purchase_order_details = this.purchaseOrder.purchase_order_details.filter((value)=>{
          return allowedPOD.includes(value.product.id)
        })

        this.purchaseOrder.purchase_order_details.forEach((value:any)=>{
          value.purchase_order_warehouses.forEach((detail:any)=>{
            warehouses.push(detail.warehouse)
          })
        })

        const key = 'id';
        this.warehouses = [...new Map(warehouses.map(item =>[item[key], item])).values()];
      });
  }

  removeWarehouse() {
    this.goodsReceiptForm.controls['warehouse'].setValue(null);
    this.goodsReceiptForm.removeControl('goods_receipt_details');
    this.goodsReceiptForm.addControl('goods_receipt_details', new FormArray([]));
  }

  onAddGoodsReceiptDetail(){
    const selectedWarehouse = this.goodsReceiptForm.value.warehouse
    const allowedPOD = this.purchaseOrder.purchase_order_details.filter(
      (value) =>
        value.purchase_order_warehouses.filter(
          (detail) => detail.warehouse_id === selectedWarehouse,
        ).length,
    );

    const products = allowedPOD.map((value) => value.product);
    // Open Dialog
    const ref = this.dialogService.open(GoodsReceiptDetailAddDialogComponent, {
      data: {
        title: 'Add Goods Receipt Detail',
        selectedWarehouse: this.goodsReceiptForm.value.warehouse,
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
        this.goodReceiptDetails.push(
          this.generateGoodsReceiptDetails(goodsReceiptDetail)
        );
      }
    });
  }

  onEditGoodsReceiptDetail(index: number){
    const selectedWarehouse = this.goodsReceiptForm.value.warehouse
    const allowedPOD = this.purchaseOrder.purchase_order_details.filter(
      (value) =>
        value.purchase_order_warehouses.filter(
          (detail) => detail.warehouse_id === selectedWarehouse,
        ).length,
    );

    const products = allowedPOD.map((value) => value.product);
    // Open Dialog
    const ref = this.dialogService.open(GoodsReceiptDetailAddDialogComponent, {
      data: {
        title: 'Edit Purchase Note Detail',
        selectedWarehouse: this.goodsReceiptForm.value.warehouse,
        allowedPOD: allowedPOD,
        products: products,
        goodsReceiptDetail: this.goodReceiptDetails.value[index],
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
        this.goodReceiptDetails.controls[index].patchValue(newData);
      }
    });
  }

  onRemoveGoodsReceiptDetail(index: number){
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.goodReceiptDetails.removeAt(index);
      },
    });
  }

  submit(){
    if(this.goodsReceiptForm.valid){
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        purchase_invoice_id: new FormControl(
          (this.goodsReceiptForm.value.purchase_invoice.id)
        ),
        date: new FormControl(
          (this.goodsReceiptForm.value.date)
        ),
        note: new FormControl(
          (this.goodsReceiptForm.value.note)
        ),
        warehouse_id: new FormControl(
          (this.goodsReceiptForm.value.warehouse)
        ),
        goods_receipt_details: new FormArray([]),
      })
      if(this.goodsReceiptForm.value.goods_receipt_details){
        let goodsReceiptDetailArrayForm: any = bodyReqForm.get('goods_receipt_details');
        this.goodsReceiptForm.value.goods_receipt_details.forEach((data: any) => {
          let fg = new FormGroup({
            product_id: new FormControl(data.product.id),
            quantity: new FormControl(data.quantity),
          })
          goodsReceiptDetailArrayForm.push(fg)
        })
      }

      this.goodsReceiptService.addGoodsReceipt(bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Goods Receipt',
            message: res.message,
          });
          this.router.navigate(['/goods-receipt/view/', res.data.id]);
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
    }else {
      // Toast
      this.fcToastService.add({
        header: 'Goods Receipt',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }

  }

}
