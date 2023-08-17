import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@features/product/interfaces/product.interface';
import { ProductService } from '@features/product/services/product.service';
import { faRefresh, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-select-dialog',
  templateUrl: './product-select-dialog.component.html',
  styleUrls: ['./product-select-dialog.component.css'],
})
export class ProductSelectDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faRefresh = faRefresh;

  products: Product[] = [];

  searchQuery: string = '';
  allowedFilteringData = true;
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = '';

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [{ name: 'name', header: 'Name' }],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  existingProduct: any[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ) {
    if (this.config.data.products) {
      this.allowedFilteringData = false;
      this.products = this.config.data.products;
    }

    if (this.config.data.title) {
      this.title = this.config.data.title;
    }

    if (this.config.data.existingProduct) {
      this.existingProduct = this.config.data.existingProduct;
    }
  }

  ngOnInit(): void {
    if (!this.config.data.products) {
      this.loadData();
    }
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setParam() {
    let queryParams: any = {
      page: this.page,
      limit: this.rows,
    };
    if (this.searchQuery) {
      queryParams.searchQuery = this.searchQuery;
    }
  }

  loadData(
    page: number = 0,
    searchQuery: string = this.searchQuery,
    filterObj: string = this.fcFilterDialogService.getFilterString(
      this.fcFilterConfig
    ),
    sortBy: string = this.fcFilterDialogService.getSortString(
      this.fcFilterConfig
    )
  ) {
    this.setParam();
    this.loading = true;

    let dataListParameter: DataListParameter = {} as DataListParameter;
    dataListParameter.rows = this.rows;
    dataListParameter.page = this.page;
    dataListParameter.sortBy = sortBy;
    dataListParameter.filterObj = filterObj;
    dataListParameter.searchQuery = searchQuery;
    this.productService
      .getProducts(dataListParameter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.totalRecords = res.data.count;

        this.totalPages =
          this.totalRecords > this.rows
            ? Math.ceil(this.totalRecords / this.rows)
            : 1;
        this.products = res.data.products;
        // check existing data
        this.existingProduct.forEach((existProduct) => {
          let productData = this.products.find(
            (data: any) => data.id == existProduct.product.id
          );
          if (productData) {
            productData.isExist = true;
          }
        });
      });
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
    this.loadData(this.page);
  }

  search() {
    this.page = 1;
    this.loadData(this.page);
  }

  submit(res: Product) {
    this.ref.close(res);
  }
  onClose() {
    this.ref.close();
  }
}
