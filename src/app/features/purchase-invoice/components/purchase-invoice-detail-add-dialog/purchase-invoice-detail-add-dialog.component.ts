import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-invoice-detail-add-dialog',
  templateUrl: './purchase-invoice-detail-add-dialog.component.html',
  styleUrls: ['./purchase-invoice-detail-add-dialog.component.css'],
})
export class PurchaseInvoiceDetailAddDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
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
  purchaseInvoiceDetails: any[] = [];
  purchaseOrderDetails: any;

  selectedPurchaseOrderDetail: any;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    if (this.config.data.purchaseInvoiceDetails) {
      this.purchaseInvoiceDetails = structuredClone(
        this.config.data.purchaseInvoiceDetails
      );
    }
    if (this.config.data.purchaseOrderDetails) {
      this.purchaseOrderDetails = structuredClone(
        this.config.data.purchaseOrderDetails
      );
    }
    // check if product is already added then status exist
    this.purchaseInvoiceDetails.forEach((purchaseInvoiceDetail: any) => {
      let purchaseOrderDetail = this.purchaseOrderDetails.find(
        (purchaseOrderDetail: any) =>
          purchaseOrderDetail.product.id === purchaseInvoiceDetail.product.id
      );
      if (purchaseOrderDetail) {
        purchaseOrderDetail.exist = true;
      }
    });

    // calculate remaining
    this.purchaseOrderDetails.forEach((purchaseOrderDetail: any) => {
      let used_quantity =
        this.purchaseInvoiceDetails.find(
          (purchaseInvoiceDetail: any) =>
            purchaseInvoiceDetail.product.id === purchaseOrderDetail.product.id
        )?.quantity || 0;
      purchaseOrderDetail.remaining_quantity =
        purchaseOrderDetail.remaining_quantity - used_quantity;
    });

    this.purchaseInvoiceDetailForm = new FormGroup({
      product: new FormControl(null, Validators.required),
      quantity: new FormControl(0, Validators.required),
      unit_price: new FormControl(0, Validators.required),
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

  // Manage Order detail
  onSelectPurchaseOrderDetail(purchaseOrderDetail: any) {
    this.selectedPurchaseOrderDetail = purchaseOrderDetail;
    this.purchaseInvoiceDetailForm.patchValue({
      product: this.selectedPurchaseOrderDetail.product,
      quantity: this.selectedPurchaseOrderDetail.remaining_quantity,
      unit_price: Number(this.selectedPurchaseOrderDetail.price_per_unit),
    });
  }

  removeProduct() {
    this.purchaseInvoiceDetailForm.controls['product'].setValue(null);
    this.purchaseInvoiceDetailForm.controls['quantity'].setValue(null);
    this.purchaseInvoiceDetailForm.controls['unit_price'].setValue(null);
    this.selectedPurchaseOrderDetail = null;
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
    this.purchaseInvoiceDetailForm.patchValue({
      subtotal: this.subtotal,
    });
    this.ref.close(this.purchaseInvoiceDetailForm.value);
  }
}
