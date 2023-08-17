import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoodsReceiptDetailSelectDialogComponent } from '@features/goods-receipt/components/goods-receipt-detail-select-dialog/goods-receipt-detail-select-dialog.component';
import { GoodsReceipt } from '@features/goods-receipt/interfaces/goods-receipt';
import { PurchaseInvoiceDetailSelectDialogComponent } from '@features/purchase-invoice/components/purchase-invoice-detail-select-dialog/purchase-invoice-detail-select-dialog.component';
import { PurchaseInvoice } from '@features/purchase-invoice/interfaces/purchase-invoice';
import {
  faChevronDown,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-return-add-detail-dialog',
  templateUrl: './purchase-return-add-detail-dialog.component.html',
  styleUrls: ['./purchase-return-add-detail-dialog.component.css'],
})
export class PurchaseReturnAddDetailDialogComponent {
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faSpinner = faSpinner;
  faChevronDown = faChevronDown;

  loading = false;
  title = '';
  purchaseInvoices: PurchaseInvoice[] = [];
  goodsReceipts: GoodsReceipt[] = [];
  purchaseReturnDetailForm: FormGroup;
  showGoodsReceipt = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private dialogService: DialogService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    if (this.config.data.destination != null) {
      const destination = this.config.data.destination;
      if (destination == 0) {
        this.showGoodsReceipt = true;
      } else {
        this.showGoodsReceipt = false;
      }
    }

    this.purchaseReturnDetailForm = new FormGroup({
      purchaseable: new FormControl('', Validators.required),
      quantity: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    if (this.config.data.purchaseReturnDetail) {
      let data = this.config.data.purchaseReturnDetail;
      this.purchaseReturnDetailForm.patchValue({
        purchaseable: data.purchaseable,
        product: data.product,
        quantity: data.quantity,
        amount: data.amount,
      });
    }
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onSelectPurchaseInvoice() {
    const ref = this.dialogService.open(
      PurchaseInvoiceDetailSelectDialogComponent,
      {
        data: {
          title: 'Select Purchase Invoice Detail',
          statusFilter: 'status=2&with_filter=1',
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
      }
    );
    ref.onClose.subscribe((purchaseInvoiceDetail) => {
      if (purchaseInvoiceDetail) {
        this.purchaseReturnDetailForm.controls['purchaseable'].setValue(
          purchaseInvoiceDetail
        );
      }
    });
  }

  removePurchaseInvoice() {
    this.purchaseReturnDetailForm.controls['purchaseable'].setValue('');
  }

  onSelectGoodsReceipt() {
    const ref = this.dialogService.open(
      GoodsReceiptDetailSelectDialogComponent,
      {
        data: {
          title: 'Select Goods Receipt Detail',
          statusFilter: 'goods_receipts-status=1&with_filter=1',
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
      }
    );
    ref.onClose.subscribe((goodsReceiptDetail) => {
      if (goodsReceiptDetail) {
        this.purchaseReturnDetailForm.controls['purchaseable'].setValue(
          goodsReceiptDetail
        );
      }
    });
  }

  removeGoodsReceipt() {
    this.purchaseReturnDetailForm.controls['purchaseable'].setValue('');
  }

  isSubmitAllowed(): boolean {
    if (this.purchaseReturnDetailForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  onClose() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.purchaseReturnDetailForm.value);
  }
}
