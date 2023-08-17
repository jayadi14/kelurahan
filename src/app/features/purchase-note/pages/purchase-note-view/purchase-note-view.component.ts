import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseNoteEditDetailComponent } from '@features/purchase-note/components/purchase-note-edit-detail/purchase-note-edit-detail.component';
import { PurchaseNote } from '@features/purchase-note/interfaces/purchase-note';
import { PurchaseNoteService } from '@features/purchase-note/services/purchase-note.service';
import { SupplierSelectDialogComponent } from '@features/supplier/components/supplier-select-dialog/supplier-select-dialog.component';
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
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-purchase-note-view',
  templateUrl: './purchase-note-view.component.html',
  styleUrls: ['./purchase-note-view.component.css'],
})
export class PurchaseNoteViewComponent {
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
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,

      action: () => {
        this.refresh();
      },
    },
  ];

  loading = false;
  purchaseNoteForm: FormGroup;
  purchaseNoteId: any;
  purchaseNote!: PurchaseNote;

  constructor(
    private layoutService: LayoutService,
    private purchaseNoteService: PurchaseNoteService,
    private fcToastService: FcToastService,
    private location: Location,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.purchaseNoteId = String(this.route.snapshot.paramMap.get('id'));

    this.purchaseNoteForm = new FormGroup({
      supplier: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      note: new FormControl(null),
      type: new FormControl(null, Validators.required),
      purchase_note_details: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  loadData() {
    this.loading = true;
    this.purchaseNoteService
      .getPurchaseNote(this.purchaseNoteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.purchaseNote = res.data;
        this.layoutService.setHeaderConfig({
          title: `Purchase Note Detail (${this.purchaseNote.supplier.name})`,
          icon: '',
          showHeader: true,
        });
        this.purchaseNoteForm.patchValue({
          supplier: this.purchaseNote.supplier,
          date: this.purchaseNote.date,
          note: this.purchaseNote.note,
          type: this.purchaseNote.type,
        });

        this.purchaseNote.purchase_note_details.forEach((data: any) => {
          this.purchaseNoteDetails.push(this.generatePurchaseNoteDetails(data));
        });
      });
  }

  get purchaseNoteDetails(): FormArray {
    return this.purchaseNoteForm.get('purchase_note_details') as FormArray;
  }

  generatePurchaseNoteDetails(purchaseNoteDetails: any): FormGroup {
    return new FormGroup({
      id: new FormControl(purchaseNoteDetails.id),
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
    const ref = this.dialogService.open(PurchaseNoteEditDetailComponent, {
      data: {
        title: 'Add Purchase Note Detail',
        purchaseNoteId: this.purchaseNoteId,
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
    const ref = this.dialogService.open(PurchaseNoteEditDetailComponent, {
      data: {
        title: 'Edit Purchase Note Detail',
        purchaseNoteId: this.purchaseNoteId,
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
        this.purchaseNoteDetails.at(index).patchValue({
          id: newData.id,
          purchase_invoice_detail: newData.purchase_invoice_detail,
          amount: newData.amount,
          description: newData.description,
        });
      }
    });
  }

  onRemovePurchaseNoteDetail(index: number, id: string) {
    this.fcConfirmService.open({
      header: 'Confirmation',
      message: 'Are you sure to delete this data?',
      accept: () => {
        this.purchaseNoteService
          .deletePurchaseNoteDetail(this.purchaseNoteId, id)
          .subscribe({
            next: (res: any) => {
              this.purchaseNoteDetails.removeAt(index);
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'success',
                header: 'Purchase Note Detail',
                message: res.message,
              });
            },
            error: (err) => {
              this.fcToastService.clear();
              this.fcToastService.add({
                severity: 'error',
                header: 'Purchase Note Detail',
                message: err.message,
              });
            },
          });
      },
    });
  }

  submit() {
    let bodyReqForm: FormGroup;
    bodyReqForm = new FormGroup({
      date: new FormControl(this.purchaseNoteForm.value.date),
      note: new FormControl(this.purchaseNoteForm.value.note),
      type: new FormControl(this.purchaseNoteForm.value.type),
    });
    this.actionButtons[0].loading = true;
    this.purchaseNoteService
      .updatePurchaseNote(this.purchaseNoteId, bodyReqForm.value)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Note',
            message: res.message,
          });
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
  refresh() {
    this.purchaseNoteForm.removeControl('purchase_note_details');
    this.purchaseNoteForm.addControl(
      'purchase_note_details',
      new FormArray([])
    );
    this.loadData();
  }
}
