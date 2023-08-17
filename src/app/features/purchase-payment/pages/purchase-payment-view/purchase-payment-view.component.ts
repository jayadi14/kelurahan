import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PurchasePaymentDetailAddDialogComponent } from '@features/purchase-payment/components/purchase-payment-detail-add-dialog/purchase-payment-detail-add-dialog.component';
import { PurchasePaymentDetailEditDialogComponent } from '@features/purchase-payment/components/purchase-payment-detail-edit-dialog/purchase-payment-detail-edit-dialog.component';
import { PurchasePayment } from '@features/purchase-payment/interfaces/purchase-payment';
import { PurchasePaymentService } from '@features/purchase-payment/services/purchase-payment.service';
import {
  faArrowRight,
  faChevronDown,
  faEye,
  faPencil,
  faPlus,
  faRefresh,
  faSave,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { number } from 'mathjs';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-payment-view',
  templateUrl: './purchase-payment-view.component.html',
  styleUrls: ['./purchase-payment-view.component.css'],
})
export class PurchasePaymentViewComponent {
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
      hidden: true,
      action: () => {
        this.submit();
      },
    },
    {
      label: 'Approve',
      icon: faSave,
      hidden: true,
      action: () => {
        this.onApprove();
      },
    },
    {
      label: 'Cancel',
      icon: faTimes,
      hidden: true,
      action: () => {
        this.onCancel();
      },
    },
    {
      label: 'Delete',
      icon: faTrash,
      hidden: true,
      action: () => {
        this.onDelete();
      },
    },
  ];
  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {
        this.refresh();
      },
    },
  ];

  purchasePayment: PurchasePayment = {} as PurchasePayment;
  purchasePaymentForm: FormGroup;
  loading = false;
  paymentMethods = [{ label: 'Cash', value: 'CASH' }];

  constructor(
    private layoutService: LayoutService,
    private purchasePaymentService: PurchasePaymentService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private route: ActivatedRoute
  ) {
    this.purchasePayment.id = this.route.snapshot.paramMap.get('id') as any;
    this.layoutService.setHeaderConfig({
      title: 'Purchase Payment',
      icon: '',
      showHeader: true,
    });
    this.purchasePaymentForm = new FormGroup({
      supplier: new FormControl(null, Validators.required),
      date: new FormControl(new Date(), Validators.required),
      payment_method: new FormControl(null, Validators.required),
      note: new FormControl(null, Validators.required),
      purchase_payment_allocations: new FormArray([]),
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.purchasePaymentDetails.value.length) {
        this.setPaymentSummaryVisibility();
      }
    }, 1);
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  generateActionButtons() {
    this.actionButtons.forEach((actionButton) => {
      actionButton.hidden = true;
    });
    switch (this.purchasePayment.status) {
      case 0: // draft
        this.actionButtons[0].hidden = false;
        this.actionButtons[1].hidden = false;
        this.actionButtons[2].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      case 1: // approved
        this.actionButtons[0].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      case 2: // cancelled
        this.actionButtons[3].hidden = false;
        break;
      default:
        break;
    }
  }
  generateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Purchase Payment (${this.purchasePayment.status_name})`,
      icon: '',
      showHeader: true,
    });
  }

  isShowPaymentSummary: boolean = false;
  @ViewChild('purchaseSummary') purchaseSummary?: ElementRef;
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
    let purchaseSummaryBoxBounds =
      this.purchaseSummary?.nativeElement.getBoundingClientRect();
    try {
      if (
        formPurchasePaymentBoxBounds.bottom -
          (purchaseSummaryBoxBounds.bottom - purchaseSummaryBoxBounds.height) <
        stickyPurchasePaymentBoxBounds.height
      ) {
        this.isShowPaymentSummary = true;
      } else {
        this.isShowPaymentSummary = false;
      }
    } catch (error) {}
  }

  scrollToBottom() {
    this.purchaseSummary?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  loadData() {
    this.loading = true;
    this.purchasePaymentService
      .getPurchasePayment(this.purchasePayment.id)
      .subscribe((res: any) => {
        this.loading = false;
        this.purchasePayment = res.data;
        this.purchasePaymentForm.patchValue(this.purchasePayment);
        this.purchasePayment.purchase_payment_allocations.forEach(
          (purchasePaymentDetail: any) => {
            this.purchasePaymentDetails.push(
              this.generatePurchasePaymentDetail(purchasePaymentDetail)
            );
          }
        );
        this.generateActionButtons();
        this.generateHeader();
      });
  }

  // Manage Purchase Payment Detail
  generatePurchasePaymentDetail(purchasePaymentDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(purchasePaymentDetail.id),
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
          let bodyReq = JSON.parse(JSON.stringify(purchasePaymentDetail)); // deep copy
          bodyReq.purchase_invoice_id = bodyReq.purchase_invoice.id;
          delete bodyReq.purchase_invoice;

          this.purchasePaymentService
            .addPurchasePaymentDetail(this.purchasePayment.id, bodyReq)
            .subscribe({
              next: (res: any) => {
                purchasePaymentDetail.id = res.data.id;
                this.purchasePaymentDetails.push(
                  this.generatePurchasePaymentDetail(purchasePaymentDetail)
                );
                this.fcToastService.add({
                  severity: 'success',
                  header: 'Success Message',
                  message: 'Purchase Payment Detail has been added',
                });
              },
              error: (err: any) => {
                this.fcToastService.add({
                  severity: 'error',
                  header: 'Error Message',
                  message: err.message,
                });
              },
            });
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
        let bodyReq = JSON.parse(JSON.stringify(purchasePaymentDetail)); // deep copy
        bodyReq.purchase_invoice_id = bodyReq.purchase_invoice.id;
        delete bodyReq.purchase_invoice;

        this.purchasePaymentService
          .updatePurchasePaymentDetail(
            this.purchasePayment.id,
            bodyReq,
            this.purchasePaymentDetails.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.purchasePaymentDetails
                .at(index)
                .patchValue(purchasePaymentDetail);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Payment Detail has been updated',
              });
            },
          });
      }
    });
  }

  deletePurchasePaymentDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchasePaymentService
          .deletePurchasePaymentDetail(
            this.purchasePayment.id,
            this.purchasePaymentDetails.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.purchasePaymentDetails.removeAt(index);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Payment Detail has been deleted',
              });
            },
          });
      },
    });
  }

  get grandTotalPrice() {
    return this.purchasePaymentDetails.value.reduce(
      (sum: any, item: any) => sum + number(item.amount_allocated),
      0
    );
  }

  back() {
    this.location.back();
  }

  refresh() {
    this.purchasePaymentForm.reset();
    this.purchasePaymentForm.removeControl('purchase_payment_allocations');
    this.purchasePaymentForm.addControl(
      'purchase_payment_allocations',
      new FormArray([])
    );
    this.loadData();
  }

  submit() {
    this.actionButtons[0].loading = true;
    let bodyReq = structuredClone(this.purchasePaymentForm.value);
    delete bodyReq.purchase_payment_allocations;
    delete bodyReq.supplier;
    this.purchasePaymentService
      .updatePurchasePayment(this.purchasePayment.id, bodyReq)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Payment',
            message: res.message,
          });
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
  }
  onApprove() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to approve this data?',
      accept: () => {
        this.purchasePaymentService
          .approvePurchasePayment(this.purchasePayment.id)
          .subscribe({
            next: (res: any) => {
              this.purchasePayment.status = res.data.status;
              this.purchasePayment.status_name = res.data.status_name;
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Payment has been approved',
              });
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: err.message,
              });
            },
          });
      },
    });
  }
  onCancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to cancel this data?',
      accept: () => {
        this.purchasePaymentService
          .cancelPurchasePayment(this.purchasePayment.id)
          .subscribe({
            next: (res: any) => {
              this.purchasePayment.status = res.data.status;
              this.purchasePayment.status_name = res.data.status_name;
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Payment has been canceled',
              });
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: err.message,
              });
            },
          });
      },
    });
  }
  onDelete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchasePaymentService
          .deletePurchasePayment(this.purchasePayment.id)
          .subscribe({
            next: (res: any) => {
              this.back();
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Payment has been deleted',
              });
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: err.message,
              });
            },
          });
      },
    });
  }
}
