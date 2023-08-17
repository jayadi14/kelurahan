import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-invoice-detail-edit-dialog',
  templateUrl: './purchase-invoice-detail-edit-dialog.component.html',
  styleUrls: ['./purchase-invoice-detail-edit-dialog.component.css'],
})
export class PurchaseInvoiceDetailEditDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  searchQuery: string = '';
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = '';

  purchaseInvoiceDetailForm: FormGroup;
  purchaseInvoiceDetail: any;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.purchaseInvoiceDetail) {
      this.purchaseInvoiceDetail = this.config.data.purchaseInvoiceDetail;
    }

    this.purchaseInvoiceDetailForm = new FormGroup({
      product: new FormControl(
        this.purchaseInvoiceDetail.product,
        Validators.required
      ),
      quantity: new FormControl(
        this.purchaseInvoiceDetail.quantity,
        Validators.required
      ),
      unit_price: new FormControl(
        this.purchaseInvoiceDetail.unit_price,
        Validators.required
      ),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // getter
  get subtotal() {
    return (
      this.purchaseInvoiceDetailForm.value.quantity *
      this.purchaseInvoiceDetailForm.value.unit_price
    );
  }

  // Validation
  isSubmitAllowed(): boolean {
    if (this.purchaseInvoiceDetailForm.valid) {
      return true;
    } else {
      return false;
    }
  }
  onClose() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.purchaseInvoiceDetailForm.value);
  }
}
