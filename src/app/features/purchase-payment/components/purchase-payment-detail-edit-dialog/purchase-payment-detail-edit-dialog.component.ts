import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PurchaseInvoice } from '@features/purchase-invoice/interfaces/purchase-invoice';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-purchase-payment-detail-edit-dialog',
  templateUrl: './purchase-payment-detail-edit-dialog.component.html',
  styleUrls: ['./purchase-payment-detail-edit-dialog.component.css'],
})
export class PurchasePaymentDetailEditDialogComponent {
  // Icons
  faTimes = faTimes;

  title = '';

  purchasePaymentDetailForm: FormGroup;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    this.purchasePaymentDetailForm = new FormGroup({
      purchase_invoice: new FormControl(
        this.config.data.purchasePaymentDetail.purchase_invoice
      ),
      amount_allocated: new FormControl(
        this.config.data.purchasePaymentDetail.amount_allocated
      ),
    });
  }

  onSelectPurchaseInvoice(purchaseInvoice: PurchaseInvoice) {
    this.purchasePaymentDetailForm.patchValue({
      purchase_invoice: purchaseInvoice,
      amount_allocated: Number(purchaseInvoice.grandtotal),
    });
  }
  onRemovePurchaseInvoice() {
    this.purchasePaymentDetailForm.reset();
  }
  submit() {
    this.ref.close(this.purchasePaymentDetailForm.value);
  }
  onClose() {
    this.ref.close();
  }
}
