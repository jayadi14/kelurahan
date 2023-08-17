import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierQuotationDetailEditDialogComponent } from '@features/supplier-quotation/components/supplier-quotation-detail-edit-dialog/supplier-quotation-detail-edit-dialog.component';
import { SupplierQuotation } from '@features/supplier-quotation/interfaces/supplier-quotation';
import { SupplierQuotationService } from '@features/supplier-quotation/services/supplier-quotation.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
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
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-supplier-quotation-view',
  templateUrl: './supplier-quotation-view.component.html',
  styleUrls: ['./supplier-quotation-view.component.css'],
})
export class SupplierQuotationViewComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowRight = faArrowRight;

  selectedSupplier: any;

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
      label: 'Receive',
      icon: faCheck,
      hidden: true,
      action: () => {
        this.receiveSupplierQuotation();
      },
    },
    {
      label: 'Cancel',
      icon: faTimes,
      hidden: true,
      action: () => {
        this.cancelSupplierQuotation();
      },
    },
    {
      label: 'Delete',
      icon: faTrash,
      hidden: true,
      action: () => {
        this.deleteSupplierQuotation();
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
  supplierQuotationForm: FormGroup;
  suplierQuotation!: SupplierQuotation;
  loading = false;
  supplierQuotationId: any;

  constructor(
    private layoutService: LayoutService,
    private supplierQuotationService: SupplierQuotationService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.supplierQuotationId = String(this.route.snapshot.paramMap.get('id'));
    this.supplierQuotationForm = new FormGroup({
      quotation_no: new FormControl(null, Validators.required),
      supplier_id: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      expected_delivery_date: new FormControl(null, Validators.required),
      tax: new FormControl(null),
      note: new FormControl(null),
      supplier_quotation_details: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isShowDetailSummary: boolean = false;
  @ViewChild('detailSummary') detailSummary?: ElementRef;
  @ViewChild('supplierQuotationFormElement')
  supplierQuotationFormElement?: ElementRef;
  @ViewChild('stickyDetailSummary')
  stickyDetailSummary?: ElementRef;
  // Detect scroll in order summary
  onScroll(event: any) {
    this.setOrderSummaryVisibility();
  }
  generateActionButtons() {
    this.actionButtons[0].hidden = true;
    this.actionButtons[1].hidden = true;
    this.actionButtons[2].hidden = true;
    this.actionButtons[3].hidden = true;
    switch (this.suplierQuotation.status) {
      case 0:
        this.actionButtons[0].hidden = false;
        this.actionButtons[1].hidden = false;
        this.actionButtons[2].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      case 1:
        this.actionButtons[0].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      case 2:
        this.actionButtons[0].hidden = false;
        this.actionButtons[3].hidden = false;
        break;
      default:
        break;
    }
  }
  updateHeader() {
    this.layoutService.setHeaderConfig({
      title: `Supplier Quotation (${this.suplierQuotation.status_name})`,
      icon: '',
      showHeader: true,
    });
  }
  setOrderSummaryVisibility() {
    let formSupplierQuotationBoxBounds =
      this.supplierQuotationFormElement?.nativeElement.getBoundingClientRect();
    let stickyDetailBoxBounds =
      this.stickyDetailSummary?.nativeElement.getBoundingClientRect();
    let detailSummaryBoxBounds =
      this.detailSummary?.nativeElement.getBoundingClientRect();
    if (
      formSupplierQuotationBoxBounds != undefined &&
      detailSummaryBoxBounds != undefined
    ) {
      if (
        formSupplierQuotationBoxBounds.bottom -
          (detailSummaryBoxBounds.bottom - detailSummaryBoxBounds.height) <
        stickyDetailBoxBounds.height
      ) {
        this.isShowDetailSummary = true;
      } else {
        this.isShowDetailSummary = false;
      }
    }
  }

  scrollToBottom() {
    this.detailSummary?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  loadData() {
    this.loading = true;
    this.supplierQuotationService
      .getSupplierQuotation(this.supplierQuotationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.suplierQuotation = res.data;
        this.selectedSupplier = this.suplierQuotation.supplier;
        this.supplierQuotationForm.patchValue({
          quotation_no: this.suplierQuotation.quotation_no,
          supplier_id: this.suplierQuotation.supplier_id,
          date: this.suplierQuotation.date,
          expected_delivery_date: this.suplierQuotation.expected_delivery_date,
          tax: Number(this.suplierQuotation.tax),
          note: this.suplierQuotation.note,
        });
        this.suplierQuotation.supplier_quotation_details.forEach(
          (data: any) => {
            this.supplierQuotationDetails.push(
              this.generateSupplierQuotationDetail(data)
            );
          }
        );
        this.generateActionButtons();
        this.updateHeader();
      });
  }

  get supplierQuotationDetails(): FormArray {
    return this.supplierQuotationForm.get(
      'supplier_quotation_details'
    ) as FormArray;
  }

  generateSupplierQuotationDetail(supplierQuotationDetail: any): FormGroup {
    return new FormGroup({
      id: new FormControl(supplierQuotationDetail.id),
      product: new FormControl(supplierQuotationDetail.product),
      quantity: new FormControl(supplierQuotationDetail.quantity),
      price_per_unit: new FormControl(supplierQuotationDetail.price_per_unit),
    });
  }

  get grandTotalPrice() {
    return this.subTotalPrice + this.supplierQuotationForm.value.tax;
  }

  get subTotalPrice() {
    return this.supplierQuotationDetails.value.reduce(
      (sum: any, item: any) => sum + item.price_per_unit * item.quantity,
      0
    );
  }

  removeSupplier() {
    this.selectedSupplier = null;
    this.supplierQuotationForm.controls['supplier_id'].setValue('');
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
        this.selectedSupplier = supplier;
        this.supplierQuotationForm.controls['supplier_id'].setValue(
          this.selectedSupplier.id
        );
      }
    });
  }

  onAddSupplierQuotationDetail() {
    const ref = this.dialogService.open(
      SupplierQuotationDetailEditDialogComponent,
      {
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
          supplierQuotationId: this.supplierQuotationId,
        },
      }
    );
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.supplierQuotationDetails.push(
          this.generateSupplierQuotationDetail(newData)
        );
      }
    });
  }

  onEditSupplierQuotationDetail(index: number) {
    const ref = this.dialogService.open(
      SupplierQuotationDetailEditDialogComponent,
      {
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
          supplierQuotationDetail:
            this.supplierQuotationDetails.controls[index].value,
          supplierQuotationId: this.supplierQuotationId,
        },
      }
    );
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.supplierQuotationDetails.controls[index].patchValue(newData);
      }
    });
  }

  onRemoveSupplierQuotationDetail(
    index: number,
    supplierQuotationDetailId: any
  ) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.supplierQuotationService
          .deleteSupplierQuotationDetail(
            this.supplierQuotationId,
            supplierQuotationDetailId
          )
          .subscribe({
            next: (res: any) => {
              this.fcToastService.add({
                severity: 'success',
                header: 'Supplier Quotation Detail',
                message: res.message,
              });
              this.supplierQuotationDetails.removeAt(index);
            },
            error: (err) => {
              this.fcToastService.add({
                severity: 'error',
                header: 'Supplier Quotation Detail',
                message: err.message,
              });
            },
          });
      },
    });
  }

  back() {
    this.location.back();
  }

  receiveSupplierQuotation() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to receive this data?',
      accept: () => {
        this.actionButtons[1].loading = true;
        this.supplierQuotationService
          .receiveSupplierQuotation(this.supplierQuotationId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[1].loading = false;
              this.fcToastService.add({
                severity: 'success',
                header: 'Receive Supplier Quotation',
                message: res.message,
              });
              this.suplierQuotation.status_name = res.data.status_name;
              this.suplierQuotation.status = res.data.status;
              this.generateActionButtons();
              this.updateHeader();
            },
            error: (err) => {
              this.actionButtons[1].loading = false;
              this.fcToastService.add({
                severity: 'error',
                header: 'Receive Supplier Quotation',
                message: err.message,
              });
            },
          });
      },
    });
  }

  cancelSupplierQuotation() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to cancel this data?',
      accept: () => {
        this.actionButtons[2].loading = true;
        this.supplierQuotationService
          .cancelSupplierQuotation(this.supplierQuotationId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[2].loading = false;
              this.fcToastService.add({
                severity: 'success',
                header: 'Cancel Supplier Quotation',
                message: res.message,
              });
              this.suplierQuotation.status_name = res.data.status_name;
              this.suplierQuotation.status = res.data.status;
              this.generateActionButtons();
              this.updateHeader();
            },
            error: (err) => {
              this.actionButtons[2].loading = false;
              this.fcToastService.add({
                severity: 'error',
                header: 'Cancel Supplier Quotation',
                message: err.message,
              });
            },
          });
      },
    });
  }

  deleteSupplierQuotation() {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.actionButtons[3].loading = true;
        this.supplierQuotationService
          .deleteSupplierQuotation(this.supplierQuotationId)
          .subscribe({
            next: (res: any) => {
              this.actionButtons[3].loading = false;
              this.fcToastService.add({
                severity: 'success',
                header: 'Delete Supplier Quotation',
                message: res.message,
              });
              this.router.navigate(['/supplier-quotation/list']);
            },
            error: (err) => {
              this.actionButtons[3].loading = false;
              this.fcToastService.add({
                severity: 'error',
                header: 'Delete Supplier Quotation',
                message: err.message,
              });
            },
          });
      },
    });
  }

  submit() {
    if (this.supplierQuotationForm.valid) {
      this.actionButtons[0].loading = true;
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        quotation_no: new FormControl(
          this.supplierQuotationForm.value.quotation_no
        ),
        supplier_id: new FormControl(
          Number(this.supplierQuotationForm.value.supplier_id)
        ),
        date: new FormControl(this.supplierQuotationForm.value.date),
        expected_delivery_date: new FormControl(
          this.supplierQuotationForm.value.expected_delivery_date
        ),
        tax: new FormControl(Number(this.supplierQuotationForm.value.tax)),
        note: new FormControl(this.supplierQuotationForm.value.note),
      });

      this.supplierQuotationService
        .updateSupplierQuotation(this.supplierQuotationId, bodyReqForm.value)
        .subscribe({
          next: (res: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Supplier Quotation',
              message: res.message,
            });
            this.suplierQuotation.quotation_no = res.data.quotation_no;
            this.suplierQuotation.status_name = res.data.status_name;
            this.suplierQuotation.status = res.data.status;
            this.generateActionButtons();
            this.updateHeader();
          },
          error: (err) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'error',
              header: 'Supplier Quotation',
              message: err.message,
            });
          },
        });
    } else {
      // Toast
      this.fcToastService.add({
        header: 'Supplier Quotation',
        message: 'Fill the form first!',
        lottieOption: {
          path: '/assets/lotties/warning.json',
          loop: false,
        },
      });
    }
  }

  refresh() {
    this.supplierQuotationForm.reset();
    this.supplierQuotationForm.removeControl('supplier_quotation_details');
    this.supplierQuotationForm.addControl(
      'supplier_quotation_details',
      new FormArray([])
    );
    this.loadData();
  }
}
