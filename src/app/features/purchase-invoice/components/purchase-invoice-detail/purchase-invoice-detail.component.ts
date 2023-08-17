import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PurchaseInvoiceDetail } from '@features/purchase-invoice/interfaces/purchase-invoice';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-purchase-invoice-detail',
  templateUrl: './purchase-invoice-detail.component.html',
  styleUrls: ['./purchase-invoice-detail.component.css'],
})
export class PurchaseInvoiceDetailComponent {
  @Input() purchaseInvoiceDetail: PurchaseInvoiceDetail =
    {} as PurchaseInvoiceDetail;
  @Input() index: number = 0;
  @Input() canEdit: boolean = false;
  @Output() onEditPurchaseInvoiceDetail = new EventEmitter<number>();
  @Output() onDeletePurchaseInvoiceDetail = new EventEmitter<number>();
  faPencil = faPencil;
  faTrash = faTrash;

  editPurchaseInvoiceDetail() {
    this.onEditPurchaseInvoiceDetail.emit(this.index);
  }
  deletePurchaseInvoiceDetail() {
    this.onDeletePurchaseInvoiceDetail.emit(this.index);
  }
}
