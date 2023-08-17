import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchaseInvoiceDetailAddDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-add-dialog/purchase-invoice-detail-add-dialog.component';
import { PurchaseInvoiceDetailEditDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-edit-dialog/purchase-invoice-detail-edit-dialog.component';
import { PurchaseInvoiceService } from '@features/purchase-invoice/services/purchase-invoice.service';
import { PurchaseOrderSelectDialogComponent } from '@features/purchase-order/components/purchase-order-select-dialog/purchase-order-select-dialog.component';
import { PurchaseOrder } from '@features/purchase-order/interfaces/purchase-order';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';

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
  selector: 'app-purchase-invoice-add',
  templateUrl: './purchase-invoice-add.component.html',
  styleUrls: ['./purchase-invoice-add.component.css'],
})
export class PurchaseInvoiceAddComponent {
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

  purchaseInvoiceForm: FormGroup;
  constructor(
    private layoutService: LayoutService,
    private dialogService: DialogService,
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private purchaseOrderService: PurchaseOrderService,
    private location: Location
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Purchase Invoice',
      icon: '',
      showHeader: true,
    });
    // init form
    this.purchaseInvoiceForm = new FormGroup({
      invoice_no: new FormControl(null, Validators.required),
      purchase_order: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      due_date: new FormControl(null, Validators.required),
      tax: new FormControl(0, Validators.required),
      note: new FormControl(null),
      purchase_invoice_details: new FormArray([], Validators.required),
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.purchaseInvoiceDetails.value.length) {
        this.setInvoiceSummaryVisibility();
      }
    }, 1);
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isShowInvoiceSummary: boolean = false;
  @ViewChild('orderSummary') orderSummary?: ElementRef;
  @ViewChild('purchaseInvoiceFormElement')
  purchaseInvoiceFormElement?: ElementRef;
  @ViewChild('stickyPurchaseInvoiceSummary')
  stickyPurchaseInvoiceSummary?: ElementRef;
  // Detect scroll in order summary
  onScroll(event: any) {
    this.setInvoiceSummaryVisibility();
  }

  setInvoiceSummaryVisibility() {
    let formPurchaseInvoiceBoxBounds =
      this.purchaseInvoiceFormElement?.nativeElement.getBoundingClientRect();
    let stickyPurchaseInvoiceBoxBounds =
      this.stickyPurchaseInvoiceSummary?.nativeElement.getBoundingClientRect();
    let orderSummaryBoxBounds =
      this.orderSummary?.nativeElement.getBoundingClientRect();
    try {
      if (
        formPurchaseInvoiceBoxBounds.bottom -
          (orderSummaryBoxBounds.bottom - orderSummaryBoxBounds.height) <
        stickyPurchaseInvoiceBoxBounds.height
      ) {
        this.isShowInvoiceSummary = true;
      } else {
        this.isShowInvoiceSummary = false;
      }
    } catch (error) {}
  }

  scrollToBottom() {
    this.orderSummary?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  // Manage Purchase Order
  onSelectPurchaseOrder() {
    const ref = this.dialogService.open(PurchaseOrderSelectDialogComponent, {
      data: {
        title: 'Select Purchase Order',
        filter: 'status=1&with_filter=1',
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
    ref.onClose.subscribe((purchaseOrder) => {
      if (purchaseOrder) {
        this.purchaseOrderService
          .getPurchaseOrder(purchaseOrder.id)
          .subscribe((res: any) => {
            let purchaseOrder: PurchaseOrder = res.data;
            this.purchaseInvoiceForm.controls['purchase_order'].setValue(
              purchaseOrder
            );
            purchaseOrder.purchase_order_details.forEach(
              (purchaseOrderDetail: any) => {
                if (purchaseOrderDetail.remaining_quantity > 0) {
                  let purchaseInvoiceDetail = {
                    product: purchaseOrderDetail.product,
                    quantity: purchaseOrderDetail.remaining_quantity,
                    unit_price: purchaseOrderDetail.price_per_unit,
                  };
                  this.purchaseInvoiceDetails.push(
                    this.generatePurchaseInvoiceDetail(purchaseInvoiceDetail)
                  );
                }
              }
            );
          });
      }
    });
  }
  removePurchaseOrder() {
    this.purchaseInvoiceForm.controls['purchase_order'].setValue(null);
    this.purchaseInvoiceForm.removeControl('purchase_invoice_details');
    this.purchaseInvoiceForm.addControl(
      'purchase_invoice_details',
      new FormArray([], Validators.required)
    );
  }

  generatePurchaseInvoiceDetail(purchaseInvoiceDetail: any): FormGroup {
    return new FormGroup({
      product: new FormControl(
        purchaseInvoiceDetail.product,
        Validators.required
      ),
      quantity: new FormControl(
        purchaseInvoiceDetail.quantity,
        Validators.required
      ),
      unit_price: new FormControl(
        purchaseInvoiceDetail.unit_price,
        Validators.required
      ),
    });
  }

  // Manage Purchase Invoice Detail
  get purchaseInvoiceDetails(): FormArray {
    return this.purchaseInvoiceForm.get(
      'purchase_invoice_details'
    ) as FormArray;
  }
  addPurchaseInvoiceDetail() {
    if (this.purchaseInvoiceForm.controls['purchase_order'].value) {
      const ref = this.dialogService.open(
        PurchaseInvoiceDetailAddDialogComponent,
        {
          data: {
            title: 'Add Purchase Invoice Detail',
            purchaseOrderDetails:
              this.purchaseInvoiceForm.controls['purchase_order'].value
                .purchase_order_details,
            purchaseInvoiceDetails: this.purchaseInvoiceDetails.value,
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
        }
      );
      ref.onClose.subscribe((purchaseInvoiceDetail) => {
        if (purchaseInvoiceDetail) {
          this.purchaseInvoiceDetails.push(
            this.generatePurchaseInvoiceDetail(purchaseInvoiceDetail)
          );
        }
      });
    } else {
      this.fcToastService.add({
        severity: 'warning',
        header: 'Warning',
        message: 'Please select purchase order first',
      });
    }
  }
  editPurchaseInvoiceDetail(index: number) {
    const ref = this.dialogService.open(
      PurchaseInvoiceDetailEditDialogComponent,
      {
        data: {
          title: 'Edit Purchase Invoice Detail',
          purchaseInvoiceDetail: this.purchaseInvoiceDetails.value[index],
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
      }
    );
    ref.onClose.subscribe((purchaseInvoiceDetail) => {
      if (purchaseInvoiceDetail) {
        this.purchaseInvoiceDetails.at(index).patchValue(purchaseInvoiceDetail);
      }
    });
  }
  deletePurchaseInvoiceDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseInvoiceDetails.removeAt(index);
      },
    });
  }

  get grandTotalPrice() {
    return this.subTotalPrice + this.purchaseInvoiceForm.value.tax;
  }

  get subTotalPrice() {
    return this.purchaseInvoiceDetails.value.reduce(
      (sum: any, item: any) => sum + item.quantity * item.unit_price,
      0
    );
  }
  back() {
    this.location.back();
  }

  submit() {
    if (this.purchaseInvoiceForm.valid) {
      let bodyReq = JSON.parse(JSON.stringify(this.purchaseInvoiceForm.value)); // deep copy
      bodyReq.purchase_order_id = bodyReq.purchase_order.id;
      delete bodyReq.purchase_order;
      bodyReq.purchase_invoice_details.forEach((purchaseInvoiceDetail: any) => {
        purchaseInvoiceDetail.product_id = purchaseInvoiceDetail.product.id;
        delete purchaseInvoiceDetail.product;
      });
      this.purchaseInvoiceService.addPurchaseInvoice(bodyReq).subscribe({
        next: (response) => {
          this.back();
          this.fcToastService.add({
            severity: 'success',
            header: 'Success Message',
            message: 'Purchase Invoice has been created successfully',
          });
        },
      });
    } else {
      // check involid formcontrol
      Object.keys(this.purchaseInvoiceForm.controls).forEach((field) => {
        const control = this.purchaseInvoiceForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });

      this.fcToastService.clear();
      this.fcToastService.add({
        severity: 'error',
        header: 'Error Message',
        message: 'Please fill all required fields',
      });
    }
  }
}
