import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '@features/product/interfaces/product.interface';
import { ProductService } from '@features/product/services/product.service';
import { SupplierQuotationDetail } from '@features/supplier-quotation/interfaces/supplier-quotation';
import { SupplierQuotationService } from '@features/supplier-quotation/services/supplier-quotation.service';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-quotation-detail-edit-dialog',
  templateUrl: './supplier-quotation-detail-edit-dialog.component.html',
  styleUrls: ['./supplier-quotation-detail-edit-dialog.component.css'],
})
export class SupplierQuotationDetailEditDialogComponent {
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faSpinner = faSpinner;

  title = 'Add Supplier Quotation';
  supplierQuotationDetail: SupplierQuotationDetail =
    {} as SupplierQuotationDetail;
  supplierQuotationDetailForm: FormGroup;
  products: Product[] = [];
  currentProducts: Product[] = [];
  supplierQuotationId: string = '';

  loading = false;
  searchQuery: string = '';
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productService: ProductService,
    private supplierQuotationService: SupplierQuotationService,
    private fcToastService: FcToastService,
  ) {
    this.supplierQuotationDetailForm = new FormGroup({
      product: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      price_per_unit: new FormControl(null, Validators.required),
    });
    if (this.config.data) {
      if (this.config.data.title) {
        this.title = this.config.data.title;
      }
      if(this.config.data.supplierQuotationId){
        this.supplierQuotationId = this.config.data.supplierQuotationId;
      }
      if (this.config.data.supplierQuotationDetail) {
        this.supplierQuotationDetail = this.config.data.supplierQuotationDetail;
        this.supplierQuotationDetailForm.patchValue(
          this.supplierQuotationDetail
        );
      }
    }
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
    this.supplierQuotationDetailForm.patchValue({
      product: product,
    });
  }
  onRemoveProduct() {
    this.supplierQuotationDetailForm.patchValue({
      product: null,
    });
  }

  onClose() {
    this.ref.close();
  }

  isSubmitAllowed(): boolean {
    if (this.supplierQuotationDetailForm.valid && this.loadingButton == false) {
      return true;
    } else {
      return false;
    }
  }

  loadingButton = false
  submit() {
    this.loadingButton = true
    // Update Supplier Quotation
    if(this.config.data.supplierQuotationDetail){
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        product_id: new FormControl(
          (this.supplierQuotationDetailForm.value.product.id)
        ),
        quantity: new FormControl(
          (this.supplierQuotationDetailForm.value.quantity)
        ),
        price_per_unit: new FormControl(
          (this.supplierQuotationDetailForm.value.price_per_unit)
        ),
      })
      this.supplierQuotationService.updateSupplierQuotationDetail(this.supplierQuotationId, this.supplierQuotationDetail.id, bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.loadingButton = false
          this.fcToastService.add({
            severity: 'success',
            header: 'Supplier Quotation Detail',
            message: res.message,
          });
          this.ref.close(this.supplierQuotationDetailForm.value);
        },
        error: (err) => {
          this.loadingButton = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Supplier Quotation Detail',
            message: err.message,
          });
        },
      });
    }
    // Add Supplier Quotation
    else{
      let bodyReqForm: FormGroup;
      bodyReqForm = new FormGroup({
        product_id: new FormControl(
          (this.supplierQuotationDetailForm.value.product.id)
        ),
        quantity: new FormControl(
          (this.supplierQuotationDetailForm.value.quantity)
        ),
        price_per_unit: new FormControl(
          (this.supplierQuotationDetailForm.value.price_per_unit)
        ),
      })
      this.supplierQuotationService.createSupplierQuotationDetail(this.supplierQuotationId, bodyReqForm.value).subscribe({
        next: (res: any) => {
          this.loadingButton = false
          this.fcToastService.add({
            severity: 'success',
            header: 'Supplier Quotation Detail',
            message: res.message,
          });
          this.ref.close(res.data);
        },
        error: (err) => {
          this.loadingButton = false;
          this.fcToastService.add({
            severity: 'error',
            header: 'Supplier Quotation Detail',
            message: err.message,
          });
        },
      });
    }
  }
}
