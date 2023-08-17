import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '@features/product/interfaces/product.interface';
import { ProductService } from '@features/product/services/product.service';
import { SupplierQuotation } from '@features/supplier-quotation/interfaces/supplier-quotation';
import {
  faSpinner,
  faTimes,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-quotation-detail-add-dialog',
  templateUrl: './supplier-quotation-detail-add-dialog.component.html',
  styleUrls: ['./supplier-quotation-detail-add-dialog.component.css'],
})
export class SupplierQuotationDetailAddDialogComponent {
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faSpinner = faSpinner;
  faRefresh = faRefresh;

  title = 'Add Supplier Quotation';
  supplierQuotation: SupplierQuotation = {} as SupplierQuotation;
  supplierQuotationForm: FormGroup;
  products: Product[] = [];
  currentProducts: Product[] = [];
  selectedProduct: Product | undefined;

  loading = false;
  searchQuery: string = '';
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productService: ProductService
  ) {
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
    }
    this.supplierQuotationForm = new FormGroup({
      product: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      price_per_unit: new FormControl(null, Validators.required),
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
      .subscribe((res: any) => {
        let response = res.data.products;
        this.loading = false;
        this.products = response.map((data: any) => {
          let isExist = this.currentProducts.find((x: any) => x.id === data.id);
          if (isExist) {
            return { ...data, isExist: true };
          } else {
            return { ...data, isExist: false };
          }
        });
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
  onSelectProduct(product: any) {
    this.selectedProduct = product;
    this.supplierQuotationForm.patchValue({
      product: product,
    });
  }
  onRemoveProduct() {
    this.selectedProduct = undefined;
    this.supplierQuotationForm.patchValue({
      product: null,
    });
  }

  onClose() {
    this.ref.close();
  }

  isSubmitAllowed(): boolean {
    if (this.supplierQuotationForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    this.ref.close(this.supplierQuotationForm.value);
  }
}
