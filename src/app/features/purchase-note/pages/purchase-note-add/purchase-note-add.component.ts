import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseNoteAddDetailComponent } from '@features/purchase-note/components/purchase-note-add-detail/purchase-note-add-detail.component';
import { PurchaseNoteService } from '@features/purchase-note/services/purchase-note.service';
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
  selector: 'app-purchase-note-add',
  templateUrl: './purchase-note-add.component.html',
  styleUrls: ['./purchase-note-add.component.css'],
})
export class PurchaseNoteAddComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faEye = faEye;
  faTrash = faTrash;
  faPencil = faPencil;
  faArrowRight = faArrowRight;

  purchaseNoteType: any = [
    {
      id: 0,
      name: 'Debit',
    },
    {
      id: 1,
      name: 'Credit',
    },
  ];

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

  loading = false;
  purchaseNoteForm: FormGroup;

  constructor(
    private layoutService: LayoutService,
    private purchaseNoteService: PurchaseNoteService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Add Purchase Note',
      icon: '',
      showHeader: true,
    });
    this.purchaseNoteForm = new FormGroup({
      supplier: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      note: new FormControl(null),
      type: new FormControl(null, Validators.required),
      purchase_note_details: new FormArray([]),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  get purchaseNoteDetails(): FormArray {
    return this.purchaseNoteForm.get('purchase_note_details') as FormArray;
  }

  generatePurchaseNoteDetails(purchaseNoteDetails: any): FormGroup {
    return new FormGroup({
      purchase_invoice_detail: new FormControl(
        purchaseNoteDetails.purchase_invoice_detail
      ),
      amount: new FormControl(purchaseNoteDetails.amount),
      description: new FormControl(purchaseNoteDetails.description),
    });
  }

  removeSupplier() {
    this.purchaseNoteForm.controls['supplier'].setValue('');
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
        this.purchaseNoteForm.controls['supplier'].setValue(supplier);
      }
    });
  }

  onAddPurchaseNoteDetail() {
    const ref = this.dialogService.open(PurchaseNoteAddDetailComponent, {
      data: {
        title: 'Add Purchase Note Detail',
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
    ref.onClose.subscribe((purchaseNoteDetail) => {
      if (purchaseNoteDetail) {
        this.purchaseNoteDetails.push(
          this.generatePurchaseNoteDetails(purchaseNoteDetail)
        );
      }
    });
  }

  onEditPurchaseNoteDetail(index: number) {
    const ref = this.dialogService.open(PurchaseNoteAddDetailComponent, {
      data: {
        title: 'Edit Purchase Note Detail',
        purchaseNoteDetail: this.purchaseNoteDetails.value[index],
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
    ref.onClose.subscribe((newData) => {
      if (newData) {
        this.purchaseNoteDetails.controls[index].patchValue(newData);
      }
    });
  }

  onRemovePurchaseNoteDetail(index: number) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseNoteDetails.removeAt(index);
      },
    });
  }

  submit() {
    let bodyReqForm: FormGroup;
    bodyReqForm = new FormGroup({
      supplier_id: new FormControl(this.purchaseNoteForm.value.supplier.id),
      date: new FormControl(this.purchaseNoteForm.value.date),
      note: new FormControl(this.purchaseNoteForm.value.note),
      type: new FormControl(this.purchaseNoteForm.value.type),
      purchase_note_details: new FormArray([]),
    });
    if (this.purchaseNoteForm.value.purchase_note_details) {
      let purchaseNoteDetailArrayForm: any = bodyReqForm.get(
        'purchase_note_details'
      );
      this.purchaseNoteForm.value.purchase_note_details.forEach((data: any) => {
        let fg = new FormGroup({
          purchase_invoice_detail_id: new FormControl(
            data.purchase_invoice_detail.id
          ),
          amount: new FormControl(data.amount),
          description: new FormControl(data.description),
        });
        purchaseNoteDetailArrayForm.push(fg);
      });
    }
    this.purchaseNoteService.addPurchaseNote(bodyReqForm.value).subscribe({
      next: (res: any) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Purchase Note',
          message: res.message,
        });
        this.router.navigate(['/purchase-note/view/', res.data.id]);
      },
      error: (err) => {
        this.actionButtons[0].loading = false;
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'error',
          header: 'Purchase Note',
          message: err.message,
        });
      },
    });
  }
}
