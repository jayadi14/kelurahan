import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '@features/product/interfaces/product.interface';
import { ProductService } from '@features/product/services/product.service';
import {
  PurchaseRequest,
  PurchaseRequestDetail,
} from '@features/purchase-request/interfaces/purchase-request';
import {
  faRefresh,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-purchase-request-add-dialog',
  templateUrl: './purchase-request-add-dialog.component.html',
  styleUrls: ['./purchase-request-add-dialog.component.css'],
})
export class PurchaseRequestAddDialogComponent {
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faSpinner = faSpinner;
  faRefresh = faRefresh;

  title = 'Add Purchase Request';
  purchaseRequest: PurchaseRequest = {} as PurchaseRequest;
  purchaseRequestForm: FormGroup;
  products: Product[] = [];
  currentProductIds: string[] = [];
  selectedProduct: Product | undefined;

  loading = false;
  searchQuery: string = '';
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;

  purchaseRequestDetails: PurchaseRequestDetail[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productService: ProductService,
    private fcToastService: FcToastService
  ) {
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
      if (this.config.data.purchaseRequestDetails) {
        this.purchaseRequestDetails = JSON.parse(
          JSON.stringify(this.config.data.purchaseRequestDetails)
        );
        this.currentProductIds = this.purchaseRequestDetails.map(
          (purchaseRequestDetail: PurchaseRequestDetail) => {
            return purchaseRequestDetail.product.id;
          }
        );
      }
    }

    this.purchaseRequestForm = new FormGroup({
      product: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}
  loadData() {
    this.loading = true;

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = this.page;
    dataListParameter.searchQuery = this.searchQuery;
    dataListParameter.sortBy = 'order_by=id&direction=desc';
    this.productService
      .getProducts(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.totalRecords = res.data.count;
          this.totalPages =
            this.totalRecords > this.rows
              ? Math.ceil(this.totalRecords / this.rows)
              : 1;
          this.products = res.data.products;
          this.products = this.products.map((product: Product) => {
            return {
              ...product,
              isExist: this.currentProductIds.includes(product.id),
            };
          });
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Error',
            message: err.message,
          });
        },
      });
  }

  search() {
    this.page = 1;
    this.loadData();
  }

  onPageUpdate(pagination: any) {
    let page = pagination.page;
    let rows = pagination.rows;
    this.rows = rows;
    if (page > 0) {
      this.page = page;
    } else {
      this.page = 1;
    }
    this.loadData();
  }
  onSelectProduct(product: Product) {
    this.selectedProduct = product;
    this.purchaseRequestForm.patchValue({
      product: product,
    });
  }
  onRemoveProduct() {
    this.selectedProduct = undefined;
    this.purchaseRequestForm.patchValue({
      product: null,
    });
  }

  onClose() {
    this.ref.close();
  }
  submit() {
    if (this.purchaseRequestForm.value.quantity > 0) {
      this.ref.close(this.purchaseRequestForm.value);
    } else {
      this.fcToastService.add({
        severity: 'warning',
        header: 'Purchase Request Detail',
        message: 'Quantity must be greater than 0',
      });
    }
  }
}
