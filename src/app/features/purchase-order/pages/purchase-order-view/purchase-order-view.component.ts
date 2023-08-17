import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessUnitSelectDialogComponent } from '@features/company/components/business-unit-select-dialog/business-unit-select-dialog.component';
import { PurchaseOrderEditDetailComponent } from '@features/purchase-order/components/purchase-order-edit-detail/purchase-order-edit-detail.component';
import {
  PurchaseOrder,
  PurchaseOrderDetail,
} from '@features/purchase-order/interfaces/purchase-order';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
import {
  faCheck,
  faChevronDown,
  faLocationDot,
  faPencil,
  faPhone,
  faPlus,
  faRefresh,
  faSave,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.css'],
})
export class PurchaseOrderViewComponent {
  private readonly destroy$ = new Subject<void>();
  // Icons
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faPlus = faPlus;
  faChevronDown = faChevronDown;
  faTimes = faTimes;
  faPencil = faPencil;
  faTrash = faTrash;

  purchaseOrderId: string = '';
  loading = false;
  purchaseOrder!: PurchaseOrder;

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
      label: 'Approve',
      icon: faCheck,
      hidden: true,
      action: () => {
        this.approvePurchaseOrder();
      },
    },
    {
      label: 'Cancel',
      icon: faTimes,
      hidden: true,
      action: () => {
        this.cancel();
      },
    },
    {
      label: 'Delete',
      icon: faTrash,
      hidden: true,
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
  purchaseOrderForm: FormGroup;
  constructor(
    private layoutService: LayoutService,
    private purchaseOrderService: PurchaseOrderService,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.purchaseOrderId = String(this.route.snapshot.paramMap.get('id'));

    // init form
    this.purchaseOrderForm = new FormGroup({
      purchase_order_no: new FormControl(null, Validators.required),
      status_name: new FormControl(null, Validators.required),
      supplier: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      expected_delivery_date: new FormControl(null, Validators.required),
      tax: new FormControl(0),
      note: new FormControl(''),
      business_unit: new FormControl(null, Validators.required),
      purchase_order_details: new FormArray([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadData();
    setTimeout(() => {
      if (this.purchaseOrderDetails.value.length) {
        this.setOrderSummaryVisibility();
      }
    }, 1);
  }

  loadData() {
    this.loading = true;
    this.purchaseOrderService
      .getPurchaseOrder(this.purchaseOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.purchaseOrder = res.data;
        this.generateActionButtons();
        this.generateHeader();
        this.purchaseOrderForm.patchValue({
          purchase_order_no: this.purchaseOrder.purchase_order_no,
          status_name: this.purchaseOrder.status_name,
          supplier: this.purchaseOrder.supplier,
          date: this.purchaseOrder.date,
          expected_delivery_date: this.purchaseOrder.expected_delivery_date,
          tax: Number(this.purchaseOrder.tax),
          note: this.purchaseOrder.note,
          business_unit: this.purchaseOrder.business_unit,
        });

        this.purchaseOrder.purchase_order_details.forEach(
          (purchaseOrderDetail: any) => {
            if(purchaseOrderDetail.supplier_quotation){
              purchaseOrderDetail.supplier_quotation.supplier_quotation_id = purchaseOrderDetail.supplier_quotation.id
            }
            this.purchaseOrderDetails.push(
              this.generatePurchaseOrderDetail(purchaseOrderDetail)
            );
          }
        );
      });
  }
  generateActionButtons() {
    // reset action buttons
    this.actionButtons[0].hidden = true; // save
    this.actionButtons[1].hidden = true; // approve
    this.actionButtons[2].hidden = true; // cancel
    this.actionButtons[3].hidden = true; // delete

    switch (this.purchaseOrder.status) {
      case 0: // pending
        this.actionButtons[0].hidden = false; // save
        this.actionButtons[1].hidden = false; // approve
        this.actionButtons[2].hidden = false; // cancel
        this.actionButtons[3].hidden = false; // delete
        break;
      case 1: // Approved
        break;
      case 2: // complete
        break;
      case 4: // cancelled
        break;
      default:
        break;
    }
  }
  generateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Purchase Order (${this.purchaseOrder.status_name})`,
      icon: '',
      showHeader: true,
    });
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isShowOrderSummary: boolean = false;
  @ViewChild('orderSummary') orderSummary?: ElementRef;
  @ViewChild('purchaseOrderFormElement') purchaseOrderFormElement?: ElementRef;
  @ViewChild('stickyPurchaseOrderSummary')
  stickyPurchaseOrderSummary?: ElementRef;
  // Detect scroll in order summary
  onScroll(event: any) {
    this.setOrderSummaryVisibility();
  }

  setOrderSummaryVisibility() {
    let formPurchaseOrderBoxBounds =
      this.purchaseOrderFormElement?.nativeElement.getBoundingClientRect();
    let stickyPurchaseOrderBoxBounds =
      this.stickyPurchaseOrderSummary?.nativeElement.getBoundingClientRect();
    let orderSummaryBoxBounds =
      this.orderSummary?.nativeElement.getBoundingClientRect();
    if (
      formPurchaseOrderBoxBounds != undefined &&
      orderSummaryBoxBounds != undefined
    ) {
      if (
        formPurchaseOrderBoxBounds.bottom -
          (orderSummaryBoxBounds.bottom - orderSummaryBoxBounds.height) <
        stickyPurchaseOrderBoxBounds.height
      ) {
        this.isShowOrderSummary = true;
      } else {
        this.isShowOrderSummary = false;
      }
    }
  }

  scrollToBottom() {
    this.orderSummary?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  get purchaseOrderDetails(): FormArray {
    return this.purchaseOrderForm.get('purchase_order_details') as FormArray;
  }

  removeBusinessUnit() {
    this.purchaseOrderForm.controls['business_unit'].setValue('');
  }

  onSelectBusinessUnit() {
    const ref = this.dialogService.open(BusinessUnitSelectDialogComponent, {
      data: {
        title: 'Select Business Unit',
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
    ref.onClose.subscribe((businessUnit: any) => {
      if (businessUnit) {
        this.purchaseOrderForm.controls['business_unit'].setValue(businessUnit);
      }
    });
  }

  removeSupplier() {
    this.purchaseOrderForm.controls['supplier'].setValue('');
  }

  onSelectSupplier() {
    const ref = this.dialogService.open(SupplierSelectDialogComponent, {
      data: {
        title: 'Select Supplier',
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
    ref.onClose.subscribe((supplier) => {
      if (supplier) {
        this.purchaseOrderForm.controls['supplier'].setValue(supplier);
      }
    });
  }

  generatePurchaseOrderDetail(purchaseOrderDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(purchaseOrderDetail.id, Validators.required),
      quotation_no: new FormControl(
        purchaseOrderDetail.quotation_no,
        Validators.required
      ),
      supplier_quotation: new FormControl(
        purchaseOrderDetail.supplier_quotation
      ),
      product: new FormControl(
        purchaseOrderDetail.product,
        Validators.required
      ),
      price_per_unit: new FormControl(
        purchaseOrderDetail.price_per_unit,
        Validators.required
      ),
      expected_delivery_date: new FormControl(
        purchaseOrderDetail.expected_delivery_date
      ),
      purchase_order_warehouses: new FormArray(
        purchaseOrderDetail.purchase_order_warehouses.map((data: any) => {
          return new FormGroup({
            id: new FormControl(data.id, Validators.required),
            warehouse: new FormControl(data.warehouse, Validators.required),
            quantity_ordered: new FormControl(
              data.quantity_ordered,
              Validators.required
            ),
          });
        })
      ),
    });
  }

  get grandTotalPrice() {
    return this.subTotalPrice + this.purchaseOrderForm.value.tax;
  }

  get subTotalPrice() {
    return this.purchaseOrderDetails.value.reduce(
      (sum: any, item: any) =>
        sum + item.price_per_unit * this.getTotalQtyItem(item),
      0
    );
  }

  getTotalQtyItem(item: any) {
    return item.purchase_order_warehouses.reduce(
      (sum_b: any, item: any) => sum_b + item.quantity_ordered,
      0
    );
  }

  addPurchaseOrderDetail() {
    const ref = this.dialogService.open(PurchaseOrderEditDetailComponent, {
      data: {
        title: 'Add Purchase Order Detail',
        existingPurchaseOrderDetails: this.purchaseOrderDetails.value,
        purchaseOrderId: this.purchaseOrderId,
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
    ref.onClose.subscribe((purchaseOrderDetail) => {
      if (purchaseOrderDetail) {
        purchaseOrderDetail.supplier_quotation.supplier_quotation_id = purchaseOrderDetail.supplier_quotation.id
        this.purchaseOrderDetails.push(
          this.generatePurchaseOrderDetail(purchaseOrderDetail)
        );
      }
    });
  }

  editPurchaseOrderDetail(index: number, pod_id: any) {
    const ref = this.dialogService.open(PurchaseOrderEditDetailComponent, {
      data: {
        title: 'Edit Purchase Order Detail',
        existingPurchaseOrderDetails: this.purchaseOrderDetails.value,
        purchaseOrderDetail: this.purchaseOrderDetails.value[index],
        purchaseOrderId: this.purchaseOrderId,
        purchaseOrderDetailId: pod_id,
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
    ref.onClose.subscribe((purchaseOrderDetail) => {
      if (purchaseOrderDetail) {
        this.purchaseOrderDetails.at(index).patchValue({
          quotation_no: purchaseOrderDetail.quotation_no,
          supplier_quotation: purchaseOrderDetail.supplier_quotation,
          product: purchaseOrderDetail.product,
          price_per_unit: purchaseOrderDetail.price_per_unit,
          expected_delivery_date: purchaseOrderDetail.expected_delivery_date,
        });

        // For updated warehouse
        let updatedWarehouseFormArray: any = new FormArray([]);
        if (purchaseOrderDetail.purchase_order_warehouses) {
          purchaseOrderDetail.purchase_order_warehouses.forEach((data: any) => {
            updatedWarehouseFormArray.push(
              new FormGroup({
                id: new FormControl(data.id),
                warehouse: new FormControl(data.warehouse),
                quantity_ordered: new FormControl(data.quantity_ordered),
              })
            );
          });
        }

        let formGroup = this.purchaseOrderDetails.at(index) as FormGroup;
        formGroup.removeControl('purchase_order_warehouses');
        formGroup.addControl(
          'purchase_order_warehouses',
          updatedWarehouseFormArray
        );
        this.purchaseOrderDetails.at(index).patchValue(formGroup);
      }
    });
  }

  removePurchaseOrderDetail(index: number, purchaseOrderDetailId: string) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseOrderService
          .deletePurchaseOrderDetail(
            this.purchaseOrderId,
            purchaseOrderDetailId
          )
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Order Detail',
                message: res.message,
              });
              this.purchaseOrderDetails.removeAt(index);
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Order Detail',
                message: err.message,
              });
            },
          });
      },
    });
  }

  cancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to cancel this purchase order?',
      accept: () => {
        this.purchaseOrderService
          .cancelPurchaseOrder(this.purchaseOrderId)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Order',
                message: res.message,
              });
              this.purchaseOrder.status = res.data.status;
              this.purchaseOrder.status_name = res.data.status_name;
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Order',
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
      message: 'Are you sure to delete this purchase order?',
      accept: () => {
        this.purchaseOrderService
          .deletePurchaseOrder(this.purchaseOrderId)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Order',
                message: res.message,
              });
              this.router.navigate(['/purchase-order/list']);
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Order',
                message: err.message,
              });
            },
          });
      },
    });
  }

  approvePurchaseOrder() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to approve this purchase order?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.purchaseOrderService
          .approvePurchaseOrder(this.purchaseOrderId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[1].loading = false;
              this.purchaseOrder.status = res.data.status;
              this.purchaseOrder.status_name = res.data.status_name;
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err) => {
              this.actionButtons[1].loading = false;
              this.fcToastService.add({
                severity: 'error',
                header: 'Approve Purchase Order',
                message: err.message,
              });
            },
          });
      },
    });
  }

  submit() {
    if (this.purchaseOrderForm.valid) {
      this.actionButtons[0].loading = true;
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        purchase_order_no: new FormControl(
          this.purchaseOrderForm.value.purchase_order_no
        ),
        supplier_id: new FormControl(
          Number(this.purchaseOrderForm.value.supplier.id)
        ),
        date: new FormControl(this.purchaseOrderForm.value.date),
        expected_delivery_date: new FormControl(
          this.purchaseOrderForm.value.expected_delivery_date
        ),
        tax: new FormControl(Number(this.purchaseOrderForm.value.tax)),
        note: new FormControl(this.purchaseOrderForm.value.note),
        business_unit_id: new FormControl(
          this.purchaseOrderForm.value.business_unit.id
        ),
      });

      this.purchaseOrderService
        .updatePurchaseOrder(this.purchaseOrderId, bodyReqForm.value)
        .subscribe({
          next: (res: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.add({
              severity: 'success',
              header: 'Purchase Order',
              message: res.message,
            });
            this.purchaseOrder.purchase_order_no = res.data.purchase_order_no;
            this.purchaseOrder.status_name = res.data.status_name;
            this.layoutService.setHeaderConfig({
              title: `${this.purchaseOrder.purchase_order_no} (${this.purchaseOrder.status_name})`,
              icon: '',
              showHeader: true,
            });
          },
          error: (err) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Purchase Order',
              message: err.message,
            });
          },
        });
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Purchase Order',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }
  refresh() {
    this.purchaseOrderForm.removeControl('purchase_order_details');
    this.purchaseOrderForm.addControl(
      'purchase_order_details',
      new FormArray([])
    );
    this.loadData();
  }
}
