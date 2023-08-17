import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PurchaseInvoiceDetailAddDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-add-dialog/purchase-invoice-detail-add-dialog.component';
import { PurchaseInvoiceDetailEditDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-edit-dialog/purchase-invoice-detail-edit-dialog.component';
import { PurchaseInvoice } from '@features/purchase-invoice/interfaces/purchase-invoice';
import { PurchaseInvoiceService } from '@features/purchase-invoice/services/purchase-invoice.service';
import { PurchaseOrderService } from '@features/purchase-order/services/purchase-order.service';
import {
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
import { Subject, forkJoin, mergeMap, of, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-invoice-view',
  templateUrl: './purchase-invoice-view.component.html',
  styleUrls: ['./purchase-invoice-view.component.css'],
})
export class PurchaseInvoiceViewComponent {
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
      hidden: true,
      action: () => {
        this.submit();
      },
    },
    {
      label: 'Approval Request',
      icon: faSave,
      hidden: true,
      action: () => {
        this.approvalRequest();
      },
    },
    {
      label: 'Approve',
      icon: faSave,
      hidden: true,
      action: () => {
        this.approve();
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

  purchaseInvoice: PurchaseInvoice = {} as PurchaseInvoice;
  loading = true;

  purchaseInvoiceForm: FormGroup;
  constructor(
    private layoutService: LayoutService,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private purchaseOrderService: PurchaseOrderService,
    private location: Location,
    private dialogService: DialogService,
    private fcToastService: FcToastService,
    private fcConfirmService: FcConfirmService,
    private route: ActivatedRoute
  ) {
    this.purchaseInvoice.id = this.route.snapshot.paramMap.get('id') as any;
    this.layoutService.setHeaderConfig({
      title: 'Purchase Invoice',
      icon: '',
      showHeader: true,
    });
    // init form
    this.purchaseInvoiceForm = new FormGroup({
      invoice_no: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      due_date: new FormControl(null, Validators.required),
      tax: new FormControl(null, Validators.required),
      note: new FormControl(null),
      purchase_invoice_details: new FormArray([]),
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.purchaseInvoiceDetails.value.length) {
        this.setInvoiceSummaryVisibility();
      }
    }, 1);
    this.loadData();
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.purchaseInvoiceService
      .getPurchaseInvoice(this.purchaseInvoice.id)
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((res1: any) => {
          return this.purchaseOrderService
            .getPurchaseOrder(res1.data.purchase_order_id)
            .pipe(
              takeUntil(this.destroy$),
              mergeMap((res2: any) => {
                return forkJoin([of(res1.data), of(res2.data)]);
              })
            );
        })
      )
      .subscribe(([purcahseInvoice, purchaseOrder]) => {
        this.loading = false;
        this.purchaseInvoice = purcahseInvoice;
        this.purchaseInvoice.purchase_order = purchaseOrder;
        this.purchaseInvoice.tax = Number(this.purchaseInvoice.tax);
        this.purchaseInvoiceForm.patchValue(this.purchaseInvoice);
        this.purchaseInvoice.purchase_invoice_details.forEach(
          (purchaseInvoiceDetail: any) => {
            if (this.purchaseInvoice.purchase_order) {
              purchaseInvoiceDetail.product =
                this.purchaseInvoice.purchase_order.purchase_order_details.find(
                  (x: any) => x.product_id == purchaseInvoiceDetail.product_id
                )?.product;
              this.purchaseInvoiceDetails.push(
                new FormGroup({
                  id: new FormControl(purchaseInvoiceDetail.id),
                  product: new FormControl(
                    purchaseInvoiceDetail.product,
                    Validators.required
                  ),
                  quantity: new FormControl(
                    Number(purchaseInvoiceDetail.quantity),
                    Validators.required
                  ),
                  unit_price: new FormControl(
                    Number(purchaseInvoiceDetail.unit_price),
                    Validators.required
                  ),
                })
              );
            }
          }
        );
        // restore remaining_quantity
        this.purchaseInvoice.purchase_order.purchase_order_details.forEach(
          (purchaseOrderDetail: any) => {
            let purchaseInvoiceDetail = this.purchaseInvoiceDetails.value.find(
              (x: any) => x.product.id == purchaseOrderDetail.product.id
            );
            if (purchaseInvoiceDetail) {
              purchaseOrderDetail.remaining_quantity =
                purchaseOrderDetail.remaining_quantity +
                purchaseInvoiceDetail.quantity;
            }
          }
        );
        this.generateActionButtons();
        this.generateHeader();
      });
  }

  generateActionButtons() {
    // reset action buttons
    this.actionButtons[0].hidden = true; // save
    this.actionButtons[1].hidden = true; // approval request
    this.actionButtons[2].hidden = true; // approve
    this.actionButtons[3].hidden = true; // cancel
    this.actionButtons[4].hidden = true; // delete

    switch (this.purchaseInvoice.status) {
      case 0: // pending
        this.actionButtons[0].hidden = false;
        this.actionButtons[1].hidden = false;
        this.actionButtons[3].hidden = false;
        this.actionButtons[4].hidden = false;
        break;
      case 1: // Approval request
        this.actionButtons[2].hidden = false;
        this.actionButtons[3].hidden = false;
        this.actionButtons[4].hidden = false;
        break;
      case 2: // Approved
        this.actionButtons[4].hidden = false;
        break;
      case 3: // cancelled
        this.actionButtons[4].hidden = true;
        break;
      default:
        this.actionButtons[4].hidden = true;
        break;
    }
  }
  generateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Purchase Invoice (${this.purchaseInvoice.status_name})`,
      icon: '',
      showHeader: true,
    });
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

  generatePurchaseInvoiceDetail(purchaseInvoiceDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(purchaseInvoiceDetail.id, Validators.required),
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
    const ref = this.dialogService.open(
      PurchaseInvoiceDetailAddDialogComponent,
      {
        data: {
          title: 'Add Purchase Invoice Detail',
          purchaseOrderDetails:
            this.purchaseInvoice.purchase_order.purchase_order_details,
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
        let bodyReq = JSON.parse(JSON.stringify(purchaseInvoiceDetail)); // deep copy
        bodyReq.product_id = bodyReq.product.id;
        delete bodyReq.product;

        this.purchaseInvoiceService
          .addPurchaseInvoiceDetail(this.purchaseInvoice.id, bodyReq)
          .subscribe({
            next: (res: any) => {
              purchaseInvoiceDetail.id = res.data.id;
              this.purchaseInvoiceDetails.push(
                this.generatePurchaseInvoiceDetail(purchaseInvoiceDetail)
              );
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Invoice Detail has been added',
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
        let bodyReq = JSON.parse(JSON.stringify(purchaseInvoiceDetail)); // deep copy
        bodyReq.product_id = bodyReq.product.id;
        delete bodyReq.product;

        this.purchaseInvoiceService
          .updatePurchaseInvoiceDetail(
            this.purchaseInvoice.id,
            bodyReq,
            this.purchaseInvoiceDetails.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.purchaseInvoiceDetails
                .at(index)
                .patchValue(purchaseInvoiceDetail);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Invoice Detail has been updated',
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
  }
  deletePurchaseInvoiceDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseInvoiceService
          .deletePurchaseInvoiceDetail(
            this.purchaseInvoice.id,
            this.purchaseInvoiceDetails.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.purchaseInvoiceDetails.removeAt(index);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Invoice Detail has been deleted',
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

  get grandTotalPrice() {
    return this.subTotalPrice + this.purchaseInvoiceForm.value.tax;
  }

  get subTotalPrice() {
    return this.purchaseInvoiceDetails.value.reduce(
      (sum: any, item: any) => sum + item.quantity * item.unit_price,
      0
    );
  }

  submit() {
    if (this.purchaseInvoiceForm.valid) {
      let bodyReq = JSON.parse(JSON.stringify(this.purchaseInvoiceForm.value)); // deep copy
      delete bodyReq.purchase_invoice_details;
      this.actionButtons[0].loading = true;
      this.purchaseInvoiceService
        .updatePurchaseInvoice(this.purchaseInvoice.id, bodyReq)
        .subscribe({
          next: (res: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.add({
              severity: 'success',
              header: 'Success Message',
              message: 'Purchase Invoice has been updated',
            });
          },
          error: (err: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.add({
              severity: 'error',
              header: 'Error Message',
              message: err.message,
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
  approve() {
    this.purchaseInvoiceService
      .approvePurchaseInvoice(this.purchaseInvoice.id)
      .subscribe({
        next: (res: any) => {
          this.purchaseInvoice.status = res.data.status;
          this.purchaseInvoice.status_name = res.data.status_name;
          this.fcToastService.add({
            severity: 'success',
            header: 'Success Message',
            message: 'Purchase Invoice has been Approved',
          });
          this.generateActionButtons();
          this.generateHeader();
        },
        error: (error) => {
          this.fcToastService.add({
            severity: 'error',
            header: 'Error Message',
            message: error.message,
          });
        },
      });
  }
  approvalRequest() {
    this.purchaseInvoiceService
      .approvalRequestPurchaseInvoice(this.purchaseInvoice.id)
      .subscribe({
        next: (res: any) => {
          this.purchaseInvoice.status = res.data.status;
          this.purchaseInvoice.status_name = res.data.status_name;
          this.fcToastService.add({
            severity: 'success',
            header: 'Success Message',
            message: 'Purchase Invoice can be approve',
          });
          this.generateActionButtons();
          this.generateHeader();
        },
        error: (error) => {
          this.fcToastService.add({
            severity: 'error',
            header: 'Error Message',
            message: error.message,
          });
        },
      });
  }
  cancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseInvoiceService
          .cancelPurchaseInvoice(this.purchaseInvoice.id)
          .subscribe({
            next: (res: any) => {
              this.purchaseInvoice.status = res.data.status;
              this.purchaseInvoice.status_name = res.data.status_name;
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Invoice has been canceled',
              });
              this.generateActionButtons();
              this.generateHeader();
            },
            error: (error) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: error.message,
              });
            },
          });
      },
    });
  }
  delete() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseInvoiceService
          .deletePurchaseInvoice(this.purchaseInvoice.id)
          .subscribe({
            next: (res) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Invoice can be approve',
              });
              this.location.back();
            },
            error: (error) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error Message',
                message: error.message,
              });
            },
          });
      },
    });
  }
  refresh() {
    this.purchaseInvoiceForm.reset();
    this.purchaseInvoiceForm.removeControl('purchase_invoice_details');
    this.purchaseInvoiceForm.addControl(
      'purchase_invoice_details',
      new FormArray([])
    );
    this.loadData();
  }
}
