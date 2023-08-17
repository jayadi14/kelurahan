import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessUnitSelectDialogComponent } from '@features/company/components/business-unit-select-dialog/business-unit-select-dialog.component';
import { PurchaseOrderAddDetailComponent } from '@features/purchase-order/components/purchase-order-add-detail/purchase-order-add-detail.component';
import { PurchaseOrderWizardDialogComponent } from '@features/purchase-order/components/purchase-order-wizard-dialog/purchase-order-wizard-dialog.component';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
import {
  faChevronDown,
  faLocationDot,
  faPencil,
  faPhone,
  faPlus,
  faSave,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-order-add',
  templateUrl: './purchase-order-add.component.html',
  styleUrls: ['./purchase-order-add.component.css'],
})
export class PurchaseOrderAddComponent {
  private readonly destroy$ = new Subject<void>();
  // Icons
  faLocationDot = faLocationDot;
  faPhone = faPhone;
  faPlus = faPlus;
  faChevronDown = faChevronDown;
  faTimes = faTimes;
  faPencil = faPencil;
  faTrash = faTrash;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
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
    private router: Router
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Purchase Order',
      icon: '',
      showHeader: true,
    });
    // init form
    this.purchaseOrderForm = new FormGroup({
      purchase_order_no: new FormControl(null, Validators.required),
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
    setTimeout(() => {
      if (this.purchaseOrderDetails.value.length) {
        this.setOrderSummaryVisibility();
      }
    }, 1);
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
    const ref = this.dialogService.open(PurchaseOrderAddDetailComponent, {
      data: {
        title: 'Add Purchase Order Detail',
        existingPurchaseOrderDetails: this.purchaseOrderDetails.value,
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
        this.purchaseOrderDetails.push(
          this.generatePurchaseOrderDetail(purchaseOrderDetail)
        );
      }
    });
  }

  editPurchaseOrderDetail(index: number) {
    const ref = this.dialogService.open(PurchaseOrderAddDetailComponent, {
      data: {
        title: 'Edit Purchase Order Detail',
        existingPurchaseOrderDetails: this.purchaseOrderDetails.value,
        purchaseOrderDetail: this.purchaseOrderDetails.value[index],
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

  removePurchaseOrderDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseOrderDetails.removeAt(index);
      },
    });
  }

  wizardPurchaseOrder() {
    const ref = this.dialogService.open(PurchaseOrderWizardDialogComponent, {
      data: {
        title: 'Wizard Purchase Order',
        existingPurchaseOrderDetails: this.purchaseOrderDetails.value,
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
      width: '600px',
    });
    ref.onClose.subscribe((purchaseOrderDetail) => {
      if (purchaseOrderDetail) {
        purchaseOrderDetail.forEach((data: any) => {
          this.purchaseOrderDetails.push(
            this.generatePurchaseOrderDetail(data)
          );
        });
      }
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
        purchase_order_details: new FormArray([]),
      });
      if (this.purchaseOrderForm.value.purchase_order_details) {
        let purchaseOrderDetailArrayForm: any = bodyReqForm.get(
          'purchase_order_details'
        );
        this.purchaseOrderForm.value.purchase_order_details.forEach(
          (data: any) => {
            let fg = new FormGroup({
              quotation_no: new FormControl(data.quotation_no),
              supplier_quotation_id: new FormControl(
                data.supplier_quotation?.supplier_quotation_id
              ),
              product_id: new FormControl(data.product.id),
              price_per_unit: new FormControl(data.price_per_unit),
              expected_delivery_date: new FormControl(
                data.expected_delivery_date
              ),
              purchase_order_warehouses: new FormArray([]),
            });
            let orderWarehouseArrayForm: any = fg.get(
              'purchase_order_warehouses'
            );
            data.purchase_order_warehouses.forEach((warehouse: any) => {
              orderWarehouseArrayForm.push(
                new FormGroup({
                  warehouse_id: new FormControl(warehouse.warehouse.id),
                  quantity_ordered: new FormControl(warehouse.quantity_ordered),
                })
              );
            });
            purchaseOrderDetailArrayForm.push(fg);
          }
        );
      }

      this.purchaseOrderService.addPurchaseOrder(bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Order',
            message: res.message,
          });
          this.router.navigate(['/purchase-order/view/', res.data.id]);
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
}
