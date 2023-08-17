import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessUnitSelectDialogComponent } from '@features/company/components/business-unit-select-dialog/business-unit-select-dialog.component';
import { PurchaseRequestAddDialogComponent } from '@features/purchase-request/components/purchase-request-add-dialog/purchase-request-add-dialog.component';
import { PurchaseRequestEditDialogComponent } from '@features/purchase-request/components/purchase-request-edit-dialog/purchase-request-edit-dialog.component';
import { PurchaseRequestService } from '@features/purchase-request/services/purchase-request.service';
import {
  faChevronDown,
  faEye,
  faPencil,
  faPlus,
  faSave,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-request-add',
  templateUrl: './purchase-request-add.component.html',
  styleUrls: ['./purchase-request-add.component.css'],
})
export class PurchaseRequestAddComponent {
  private destroy$: any = new Subject();
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
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

  purchaseRequestForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private purchaseRequestService: PurchaseRequestService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Purchase Request',
      icon: '',
      showHeader: true,
    });
    this.purchaseRequestForm = new FormGroup({
      business_unit: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      purchase_request_no: new FormControl('', Validators.required),
      purchase_request_details: new FormArray([]),
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.purchaseRequestDetails.value.length) {
        this.setPurchaseRequestDetailSummaryVisibility();
      }
    }, 1);
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}
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

  get purchaseRequestDetails(): FormArray {
    return this.purchaseRequestForm.get(
      'purchase_request_details'
    ) as FormArray;
  }
  generatePurchaseRequestDetail(purchaseRequestDetail: any): FormGroup {
    return new FormGroup({
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
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.purchaseRequestDetails.push(
          this.generatePurchaseRequestDetail(newData)
        );
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
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.purchaseRequestDetails.controls[index].patchValue(newData);
      }
    });
  }
  onRemovePurchaseRequestDetail(index: number) {
    this.purchaseRequestDetails.removeAt(index);
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
      let bodyReq = structuredClone(this.purchaseRequestForm.value);
      bodyReq.purchase_request_details = bodyReq.purchase_request_details.map(
        (prd: any) => {
          return {
            product_id: prd.product.id,
            quantity: prd.quantity,
          };
        }
      );
      bodyReq.business_unit_id = bodyReq.business_unit.id;
      delete bodyReq.business_unit;

      this.purchaseRequestService.addPurchaseRequest(bodyReq).subscribe({
        next: (res: any) => {
          this.purchaseRequestForm.reset();
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Request',
            message: res.message,
          });
          this.back();
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
      this.fcToastService.clear();
      this.fcToastService.add({
        severity: 'error',
        header: 'Purchase Request',
        message: 'Please fill all required fields',
      });
    }
  }
}
