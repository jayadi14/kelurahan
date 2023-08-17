import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierQuotationDetailAddDialogComponent } from '@features/supplier-quotation/components/supplier-quotation-detail-add-dialog/supplier-quotation-detail-add-dialog.component';
import { SupplierQuotationDetailEditDialogComponent } from '@features/supplier-quotation/components/supplier-quotation-detail-edit-dialog/supplier-quotation-detail-edit-dialog.component';
import { SupplierQuotationService } from '@features/supplier-quotation/services/supplier-quotation.service';
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
  selector: 'app-supplier-quotation-add',
  templateUrl: './supplier-quotation-add.component.html',
  styleUrls: ['./supplier-quotation-add.component.css'],
})
export class SupplierQuotationAddComponent {
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
      action: () => {
        this.submit();
      },
    },
  ];
  hiddenActionButtons: any[] = [];

  supplierQuotationForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private supplierQuotationService: SupplierQuotationService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Supplier Quotation',
      icon: '',
      showHeader: true,
    });
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
  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

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

  get supplierQuotationDetails(): FormArray {
    return this.supplierQuotationForm.get(
      'supplier_quotation_details'
    ) as FormArray;
  }

  generateSupplierQuotationDetail(supplierQuotationDetail: any): FormGroup {
    return new FormGroup({
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
      SupplierQuotationDetailAddDialogComponent,
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
        },
      }
    );
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.supplierQuotationDetails.controls[index].patchValue(newData);
      }
    });
  }
  onRemoveSupplierQuotationDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.supplierQuotationDetails.removeAt(index);
      },
    });
  }

  back() {
    this.location.back();
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
        supplier_quotation_details: new FormArray([]),
      });
      if (this.supplierQuotationForm.value.supplier_quotation_details) {
        let supplierQuotationDetailArrayForm: any = bodyReqForm.get(
          'supplier_quotation_details'
        );
        this.supplierQuotationForm.value.supplier_quotation_details.forEach(
          (data: any) => {
            let fg = new FormGroup({
              product_id: new FormControl(data.product.id),
              quantity: new FormControl(data.quantity),
              price_per_unit: new FormControl(data.price_per_unit),
            });
            supplierQuotationDetailArrayForm.push(fg);
          }
        );
      }
      this.supplierQuotationService
        .addSupplierQuotation(bodyReqForm.value)
        .subscribe({
          next: (res: any) => {
            this.actionButtons[0].loading = false;
            this.fcToastService.clear();
            this.fcToastService.add({
              severity: 'success',
              header: 'Supplier Quotation',
              message: res.message,
            });
            this.router.navigate(['/supplier-quotation/view/', res.data.id]);
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
}
