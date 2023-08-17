import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '@features/product/interfaces/product.interface';
import { PurchaseRequestDetail } from '@features/purchase-request/interfaces/purchase-request';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-request-edit-dialog',
  templateUrl: './purchase-request-edit-dialog.component.html',
  styleUrls: ['./purchase-request-edit-dialog.component.css'],
})
export class PurchaseRequestEditDialogComponent {
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faSpinner = faSpinner;

  title = 'Add Purchase Request';
  purchaseRequestDetail: PurchaseRequestDetail = {} as PurchaseRequestDetail;
  purchaseRequestDetailForm: FormGroup;
  currentProducts: Product[] = [];

  loading = false;
  searchQuery: string = '';
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fcToastService: FcToastService
  ) {
    this.purchaseRequestDetailForm = new FormGroup({
      product: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
      if (this.config.data.purchaseRequestDetail) {
        this.purchaseRequestDetail = this.config.data.purchaseRequestDetail;
        this.purchaseRequestDetailForm.patchValue(this.purchaseRequestDetail);
      }
    }
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onClose() {
    this.ref.close();
  }
  submit() {
    if (this.purchaseRequestDetailForm.valid) {
      this.ref.close(this.purchaseRequestDetailForm.value);
    } else {
      this.fcToastService.add({
        severity: 'warning',
        header: 'Purchase Request Detail',
        message: 'Please fill in all required fields.',
      });
    }
  }
}
