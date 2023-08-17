import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { PurchaseInvoiceSelectDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-select-dialog/purchase-invoice-select-dialog.component';
import { PurchaseNoteService } from '@features/purchase-note/services/purchase-note.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { PurchaseInvoiceDetailSelectDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-select-dialog/purchase-invoice-detail-select-dialog.component';

@Component({
  selector: 'app-purchase-note-edit-detail',
  templateUrl: './purchase-note-edit-detail.component.html',
  styleUrls: ['./purchase-note-edit-detail.component.css']
})
export class PurchaseNoteEditDetailComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faSpinner = faSpinner;
  faChevronDown = faChevronDown

  loading = false;
  title = '';
  purchaseNoteDetailForm: FormGroup;
  purchaseNoteId!: string

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private fcConfirmService: FcConfirmService,
    private purchaseNoteService: PurchaseNoteService,
    private fcToastService: FcToastService,
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    this.purchaseNoteDetailForm = new FormGroup({
      purchase_invoice_detail: new FormControl('', Validators.required),
      amount: new FormControl(null, Validators.required),
      description: new FormControl(null),
    });

    if (this.config.data.purchaseNoteId) {
      this.purchaseNoteId = this.config.data.purchaseNoteId;
    }

    if(this.config.data.purchaseNoteDetail){
      let data = this.config.data.purchaseNoteDetail;
      this.purchaseNoteDetailForm.patchValue({
        purchase_invoice_detail: data.purchase_invoice_detail,
        amount: data.amount,
        description: data.description,
      });
    }
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onSelectPurchaseInvoiceDetail(){
    const ref = this.dialogService.open(PurchaseInvoiceDetailSelectDialogComponent, {
      data: {
        title: 'Select Purchase Invoice Detail',
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
    ref.onClose.subscribe((purchaseInvoiceDetail) => {
      if (purchaseInvoiceDetail) {
        this.purchaseNoteDetailForm.controls['purchase_invoice_detail'].setValue(purchaseInvoiceDetail);
      }
    });
  }

  removePurchaseInvoiceDetail(){
    this.purchaseNoteDetailForm.controls['purchase_invoice_detail'].setValue('');

  }

  isSubmitAllowed(): boolean {
    if (this.purchaseNoteDetailForm.valid && this.loadingButton == false) {
      return true;
    } else {
      return false;
    }
  }

  onClose(){
    this.ref.close();
  }

  loadingButton = false
  submit() {
    this.loadingButton = true
    let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        purchase_invoice_detail_id: new FormControl(
          (this.purchaseNoteDetailForm.value.purchase_invoice_detail.id)
        ),
        amount: new FormControl(this.purchaseNoteDetailForm.value.amount),
        description: new FormControl(this.purchaseNoteDetailForm.value.description),
      })
    if(this.config.data.purchaseNoteDetail){
      let configData = this.config.data.purchaseNoteDetail
      this.purchaseNoteService.updatePurchaseNoteDetail(this.purchaseNoteId, configData.id, bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.ref.close(res.data)
          this.loadingButton = false
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Note Detail',
            message: res.message,
          });
        },
        error: (err) => {
          this.loadingButton = false
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Purchase Note Detail',
            message: err.message,
          });
        },
      });
    }
    else{
      this.purchaseNoteService.addPurchaseNoteDetail(this.purchaseNoteId, bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.ref.close(res.data)
          this.loadingButton = false
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Purchase Note Detail',
            message: res.message,
          });
        },
        error: (err) => {
          this.loadingButton = false
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Purchase Note Detail',
            message: err.message,
          });
        },
      });
    }
  }


}
