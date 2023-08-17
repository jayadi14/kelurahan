import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchasePaymentDetailAddDialogComponent } from '@features/purchase-payment/components/purchase-payment-detail-add-dialog/purchase-payment-detail-add-dialog.component';
import { PurchasePaymentDetailEditDialogComponent } from '@features/purchase-payment/components/purchase-payment-detail-edit-dialog/purchase-payment-detail-edit-dialog.component';
import { PurchasePaymentService } from '@features/purchase-payment/services/purchase-payment.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
import {
  faArrowRight,
  faChevronDown,
  faEye,
  faPencil,
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
  selector: 'app-purchase-payment-add',
  templateUrl: './purchase-payment-add.component.html',
  styleUrls: ['./purchase-payment-add.component.css'],
})
export class PurchasePaymentAddComponent {
  private destroy$: any = new Subject();
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowRight = faArrowRight;
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
  ];
  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [];

  purchasePaymentForm: FormGroup;
  loading = false;
  paymentMethods = [{ label: 'Cash', value: 'CASH' }];

  constructor(
    private layoutService: LayoutService,
    private purchasePaymentService: PurchasePaymentService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Purchase Payment',
      icon: '',
      showHeader: true,
    });
    this.purchasePaymentForm = new FormGroup({
      supplier: new FormControl(null, Validators.required),
      date: new FormControl(new Date(), Validators.required),
      payment_method: new FormControl(null, Validators.required),
      note: new FormControl(''),
      purchase_payment_allocations: new FormArray([]),
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.purchasePaymentDetails.value.length) {
        this.setPaymentSummaryVisibility();
      }
    }, 1);
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}
  isShowPaymentSummary: boolean = false;
  @ViewChild('orderSummary') orderSummary?: ElementRef;
  @ViewChild('purchasePaymentFormElement')
  purchasePaymentFormElement?: ElementRef;
  @ViewChild('stickyPurchasePaymentSummary')
  stickyPurchasePaymentSummary?: ElementRef;
  // Detect scroll in order summary
  onScroll(event: any) {
    this.setPaymentSummaryVisibility();
  }

  setPaymentSummaryVisibility() {
    let formPurchasePaymentBoxBounds =
      this.purchasePaymentFormElement?.nativeElement.getBoundingClientRect();
    let stickyPurchasePaymentBoxBounds =
      this.stickyPurchasePaymentSummary?.nativeElement.getBoundingClientRect();
    let orderSummaryBoxBounds =
      this.orderSummary?.nativeElement.getBoundingClientRect();
    try {
      if (
        formPurchasePaymentBoxBounds.bottom -
          (orderSummaryBoxBounds.bottom - orderSummaryBoxBounds.height) <
        stickyPurchasePaymentBoxBounds.height
      ) {
        this.isShowPaymentSummary = true;
      } else {
        this.isShowPaymentSummary = false;
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

  // Manage Supplier
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
        this.purchasePaymentForm.patchValue({
          supplier: supplier,
        });
      }
    });
  }
  removeSupplier() {
    this.purchasePaymentForm.controls['supplier'].setValue(null);
  }

  // Manage Purchase Payment Detail
  generatePurchasePaymentDetail(purchasePaymentDetail: any): FormGroup {
    return new FormGroup({
      purchase_invoice: new FormControl(
        purchasePaymentDetail.purchase_invoice,
        Validators.required
      ),
      amount_allocated: new FormControl(
        purchasePaymentDetail.amount_allocated,
        Validators.required
      ),
    });
  }
  get purchasePaymentDetails(): FormArray {
    return this.purchasePaymentForm.get(
      'purchase_payment_allocations'
    ) as FormArray;
  }
  addPurchasePaymentDetail() {
    if (this.purchasePaymentForm.controls['supplier'].value) {
      const ref = this.dialogService.open(
        PurchasePaymentDetailAddDialogComponent,
        {
          data: {
            title: 'Add Purchase Payment Detail',
            supplier: this.purchasePaymentForm.controls['supplier'].value,
            purchasePaymentDetails: this.purchasePaymentDetails.value,
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
      ref.onClose.subscribe((purchasePaymentDetail) => {
        if (purchasePaymentDetail) {
          this.purchasePaymentDetails.push(
            this.generatePurchasePaymentDetail(purchasePaymentDetail)
          );
        }
      });
    } else {
      this.fcToastService.add({
        severity: 'warning',
        header: 'Warning',
        message: 'Please select Supplier first',
      });
    }
  }
  editPurchasePaymentDetail(index: number) {
    const ref = this.dialogService.open(
      PurchasePaymentDetailEditDialogComponent,
      {
        data: {
          title: 'Edit Purchase Payment Detail',
          purchasePaymentDetail: this.purchasePaymentDetails.value[index],
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
    ref.onClose.subscribe((purchasePaymentDetail) => {
      if (purchasePaymentDetail) {
        this.purchasePaymentDetails.at(index).patchValue(purchasePaymentDetail);
      }
    });
  }
  deletePurchasePaymentDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchasePaymentDetails.removeAt(index);
      },
    });
  }

  get grandTotalPrice() {
    return this.purchasePaymentDetails.value.reduce(
      (sum: any, item: any) => sum + item.amount_allocated,
      0
    );
  }

  back() {
    this.location.back();
  }
  submit() {
    if (this.purchasePaymentForm.valid) {
      this.actionButtons[0].loading = true;
      let bodyReq = structuredClone(this.purchasePaymentForm.value);
      bodyReq.supplier_id = bodyReq.supplier.id;
      bodyReq.purchase_payment_allocations =
        bodyReq.purchase_payment_allocations.map((item: any) => {
          return {
            purchase_invoice_id: item.purchase_invoice.id,
            amount_allocated: item.amount_allocated,
          };
        });
      delete bodyReq.supplier;
      this.purchasePaymentService.addPurchasePayment(bodyReq).subscribe({
        next: (res: any) => {
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Payment',
            message: res.message,
          });
          this.back();
        },
        error: (err) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Purchase Payment',
            message: err.message,
          });
        },
      });
    } else {
      this.fcToastService.add({
        severity: 'warning',
        header: 'Purchase Payment',
        message: 'Please fill all required field',
      });
    }
  }
}
