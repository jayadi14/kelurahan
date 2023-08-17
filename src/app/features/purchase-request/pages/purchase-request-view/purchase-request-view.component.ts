import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BusinessUnitSelectDialogComponent } from '@features/company/components/business-unit-select-dialog/business-unit-select-dialog.component';
import { PurchaseRequestAddDialogComponent } from '@features/purchase-request/components/purchase-request-add-dialog/purchase-request-add-dialog.component';
import { PurchaseRequestEditDialogComponent } from '@features/purchase-request/components/purchase-request-edit-dialog/purchase-request-edit-dialog.component';
import { PurchaseRequest } from '@features/purchase-request/interfaces/purchase-request';
import { PurchaseRequestService } from '@features/purchase-request/services/purchase-request.service';
import {
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
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-request-view',
  templateUrl: './purchase-request-view.component.html',
  styleUrls: ['./purchase-request-view.component.css'],
})
export class PurchaseRequestViewComponent {
  private destroy$: any = new Subject();
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  actionButtons: any[] = [];
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

  purchaseRequestForm: FormGroup;
  loading = false;

  purchaseRequest: PurchaseRequest = {} as PurchaseRequest;

  constructor(
    private layoutService: LayoutService,
    private purchaseRequestService: PurchaseRequestService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private fcConfirmService: FcConfirmService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Purchase Request',
      icon: '',
      showHeader: true,
    });
    this.purchaseRequestForm = new FormGroup({
      business_unit: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      purchase_request_no: new FormControl('', Validators.required),
      purchase_request_details: new FormArray([]),
    });
    this.purchaseRequest.id = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  isShowPurchaseRequestDetailSummary: boolean = false;
  @ViewChild('purchaseRequestDetailSummary')
  purchaseRequestDetailSummary?: ElementRef;
  @ViewChild('purchaseRequestFormElement')
  purchaseRequestFormElement?: ElementRef;
  @ViewChild('stickyPurchaseRequestDetailSummary')
  stickyPurchaseRequestDetailSummary?: ElementRef;
  onScroll(event: any) {
    this.setPurchaseRequestDetailSummaryVisibility();
  }

  setPurchaseRequestDetailSummaryVisibility() {
    let formPurchaseOrderBoxBounds =
      this.purchaseRequestFormElement?.nativeElement.getBoundingClientRect();
    let stickyPurchaseOrderBoxBounds =
      this.stickyPurchaseRequestDetailSummary?.nativeElement.getBoundingClientRect();
    let purchaseRequestDetailSummaryBoxBounds =
      this.purchaseRequestDetailSummary?.nativeElement.getBoundingClientRect();

    if (
      formPurchaseOrderBoxBounds != undefined &&
      purchaseRequestDetailSummaryBoxBounds != undefined
    ) {
      if (
        formPurchaseOrderBoxBounds.bottom -
          (purchaseRequestDetailSummaryBoxBounds.bottom -
            purchaseRequestDetailSummaryBoxBounds.height) <
        stickyPurchaseOrderBoxBounds.height
      ) {
        this.isShowPurchaseRequestDetailSummary = true;
      } else {
        this.isShowPurchaseRequestDetailSummary = false;
      }
    }
  }

  scrollToBottom() {
    this.purchaseRequestDetailSummary?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }
  generateActionButtons() {
    switch (this.purchaseRequest.status) {
      case 0:
        this.actionButtons = [
          {
            label: 'Save',
            icon: faSave,
            action: () => {
              this.submit();
            },
          },
          {
            label: 'Approval Request',
            icon: faSave,
            action: () => {
              this.approvalRequest();
            },
          },
          {
            label: 'Cancel',
            icon: faTimes,
            action: () => {
              this.cancel();
            },
          },
          {
            label: 'Delete',
            icon: faTrash,
            action: () => {
              this.delete();
            },
          },
        ];
        break;
      case 1:
        this.actionButtons = [
          {
            label: 'Save',
            icon: faSave,
            action: () => {
              this.submit();
            },
          },
          {
            label: 'Approve',
            icon: faSave,
            action: () => {
              this.approve();
            },
          },
          {
            label: 'Cancel',
            icon: faTimes,
            action: () => {
              this.cancel();
            },
          },
          {
            label: 'Delete',
            icon: faTrash,
            action: () => {
              this.delete();
            },
          },
        ];
        break;
      case 2:
        this.actionButtons = [
          {
            label: 'Save',
            icon: faSave,
            action: () => {
              this.submit();
            },
          },
          {
            label: 'Delete',
            icon: faTrash,
            action: () => {
              this.delete();
            },
          },
        ];
        break;
      case 3:
        this.actionButtons = [
          {
            label: 'Save',
            icon: faSave,
            action: () => {
              this.submit();
            },
          },
          {
            label: 'Delete',
            icon: faTrash,
            action: () => {
              this.delete();
            },
          },
        ];
        break;
      default:
        this.actionButtons = [];
        break;
    }
  }
  updateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Purchase Request (${this.purchaseRequest.status_name})`,
      icon: '',
      showHeader: true,
    });
  }

  loadData() {
    this.loading = true;
    this.purchaseRequestService
      .getPurchaseRequest(this.purchaseRequest.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.purchaseRequest = res.data;
          this.purchaseRequestForm.patchValue(this.purchaseRequest);
          this.purchaseRequest.purchase_request_details.map(
            (purchaseRequestDetail: any) => {
              this.purchaseRequestDetails.push(
                this.generatePurchaseRequestDetail(purchaseRequestDetail)
              );
            }
          );
          this.updateHeader();
          this.generateActionButtons();
        },
        error: (err: any) => {
          this.loading = false;
          this.back();
          this.fcToastService.add({
            severity: 'error',
            header: 'Error',
            message: err.message,
          });
        },
      });
  }

  get purchaseRequestDetails(): FormArray {
    return this.purchaseRequestForm.get(
      'purchase_request_details'
    ) as FormArray;
  }

  generatePurchaseRequestDetail(purchaseRequestDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(purchaseRequestDetail.id, Validators.required),
      product: new FormControl(
        purchaseRequestDetail.product,
        Validators.required
      ),
      quantity: new FormControl(
        purchaseRequestDetail.quantity,
        Validators.required
      ),
    });
  }

  onAddPurchaseRequestDetail() {
    const ref = this.dialogService.open(PurchaseRequestAddDialogComponent, {
      showHeader: false,
      data: {
        title: 'Add Purchase Request Detail',
        purchaseRequestDetails: this.purchaseRequestDetails.value,
      },
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
    ref.onClose.subscribe((purchaseRequestDetail) => {
      if (purchaseRequestDetail) {
        let bodyReq = {
          quantity: purchaseRequestDetail.quantity,
          product_id: purchaseRequestDetail.product.id,
        };
        this.purchaseRequestService
          .addPurchaseRequestDetail(this.purchaseRequest.id, bodyReq)
          .subscribe({
            next: (res: any) => {
              this.purchaseRequestDetails.push(
                this.generatePurchaseRequestDetail(res.data)
              );
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error',
                message: err.message,
              });
            },
          });
      }
    });
  }

  onEditPurchaseRequestDetail(index: number) {
    const ref = this.dialogService.open(PurchaseRequestEditDialogComponent, {
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
      data: {
        purchaseRequestDetail:
          this.purchaseRequestDetails.controls[index].value,
      },
    });
    ref.onClose.subscribe((purchaseRequestDetail) => {
      if (purchaseRequestDetail) {
        let bodyReq = JSON.parse(JSON.stringify(purchaseRequestDetail)); // deep copy
        bodyReq.product_id = bodyReq.product.id;
        delete bodyReq.product;

        this.purchaseRequestService
          .updatePurchaseRequestDetail(
            this.purchaseRequest.id,
            bodyReq,
            this.purchaseRequestDetails.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.purchaseRequestDetails
                .at(index)
                .patchValue(purchaseRequestDetail);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Request Detail has been updated',
              });
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error',
                message: err.message,
              });
            },
          });
      }
    });
  }

  onRemovePurchaseRequestDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseRequestService
          .deletePurchaseRequestDetail(
            this.purchaseRequest.id,
            this.purchaseRequestDetails.value[index].id
          )
          .subscribe({
            next: (res: any) => {
              this.purchaseRequestDetails.removeAt(index);
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Request Detail has been deleted',
              });
            },
            error: (err: any) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Error',
                message: err.message,
              });
            },
          });
      },
    });
  }

  removeBusinessUnit() {
    this.purchaseRequestForm.controls['business_unit'].setValue('');
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
        this.purchaseRequestForm.controls['business_unit'].setValue(
          businessUnit
        );
      }
    });
  }
  get grandTotalPrice() {
    return this.purchaseRequestDetails.value.reduce(
      (sum: any, item: any) => sum + item.product.base_price * item.quantity,
      0
    );
  }

  back() {
    this.location.back();
  }

  submit() {
    if (this.purchaseRequestForm.valid) {
      this.actionButtons[0].loading = true;
      let bodyReq = JSON.parse(JSON.stringify(this.purchaseRequestForm.value)); // deep copy
      bodyReq = { ...bodyReq, business_unit_id: bodyReq.business_unit.id };
      delete bodyReq.purchase_request_details;
      delete bodyReq.business_unit;

      this.purchaseRequestService
        .updatePurchaseRequest(this.purchaseRequest.id, bodyReq)
        .subscribe({
          next: (res: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Purchase Request',
              message: res.message,
            });
          },
          error: (err) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'error',
              header: 'Purchase Request',
              message: err.message,
            });
          },
        });
    } else {
      this.fcToastService.add({
        severity: 'error',
        header: 'Error Message',
        message: 'Please fill all required fields',
      });
    }
  }

  approvalRequest() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to request approval this data?',
      accept: () => {
        this.purchaseRequestService
          .approvalRequestPurchaseRequest(this.purchaseRequest.id)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Request has been requested approval',
              });
              this.purchaseRequest.status = res.data.status;
              this.purchaseRequest.status_name = res.data.status_name;
              this.updateHeader();
              this.generateActionButtons();
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

  approve() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to approve this data?',
      accept: () => {
        this.purchaseRequestService
          .approvePurchaseRequest(this.purchaseRequest.id)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Request has been approved',
              });
              this.purchaseRequest.status = res.data.status;
              this.purchaseRequest.status_name = res.data.status_name;
              this.updateHeader();
              this.generateActionButtons();
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

  cancel() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to cancel this data?',
      accept: () => {
        this.purchaseRequestService
          .cancelPurchaseRequest(this.purchaseRequest.id)
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Request has been canceled',
              });
              this.purchaseRequest.status = res.data.status;
              this.purchaseRequest.status_name = res.data.status_name;
              this.updateHeader();
              this.generateActionButtons();
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
        this.purchaseRequestService
          .deletePurchaseRequest(this.purchaseRequest.id)
          .subscribe({
            next: (res) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Success Message',
                message: 'Purchase Request has been deleted',
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
    this.purchaseRequestForm.reset();
    this.purchaseRequestForm.removeControl('purchase_request_details');
    this.purchaseRequestForm.addControl(
      'purchase_request_details',
      new FormArray([])
    );
    this.loadData();
  }
}
