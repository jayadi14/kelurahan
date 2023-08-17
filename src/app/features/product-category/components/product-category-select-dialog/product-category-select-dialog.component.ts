import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ProductCategory } from '@features/product-category/interfaces/product-category';
import { faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { Subject } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductCategoryService } from '@features/product-category/services/product-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FcFilterDialogService } from '@shared/components/fc-filter-dialog/services/fc-filter-dialog.service';
import { MessageService } from 'primeng/api';
import { prod } from 'mathjs';

@Component({
  selector: 'app-product-category-select-dialog',
  templateUrl: './product-category-select-dialog.component.html',
  styleUrls: ['./product-category-select-dialog.component.css']
})
export class ProductCategorySelectDialogComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  private destroy$: any = new Subject();
  // Icons
  faTimes = faTimes;
  faChevronRight = faChevronRight

  productCategories: ProductCategory[] = [];
  activeRootCategory: any;
  selectedCategory: any

  searchQuery: string = '';
  loading = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  title = '';

  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [
        { name: 'name', header: 'Name' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private fcFilterDialogService: FcFilterDialogService,
    private messageService: MessageService
  ) {
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
  }

  ngOnInit(): void {
    this.loadData()
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  loadData() {
    this.loading = true
    this.productCategoryService.getProductCategories().subscribe((res: any) => {
      this.loading = false
      let data = res.data.product_categories;
      this.handleProductCategories(data);
    });
  }

  handleProductCategories(productCategories: ProductCategory[]) {
    // fetch product categories with their sub
    productCategories = productCategories.map(
      (productCategory: ProductCategory) => {
        productCategory.subcategories = productCategories.filter(
          (subCategory: ProductCategory) =>
            subCategory.category_parent_id === productCategory.id
        );
        return productCategory;
      }
    );
    // filter only parent categories
    productCategories = productCategories.filter(
      (productCategory: ProductCategory) =>
        productCategory.category_parent_id === null
    );
    this.productCategories = productCategories;
    this.onShowCategory(this.productCategories[0])
  }


  isSubmitAllowed(): boolean {
    if (this.selectedCategory) {
      return true;
    } else {
      return false;
    }
  }

  onClose(){
    this.ref.close();
  }

  onShowCategory(category:ProductCategory){
    this.activeRootCategory = category;
    this.onSelectCategory(category);
  }
  onSelectCategory(category:ProductCategory){
    this.selectedCategory = category
  }

  submit(){
    this.ref.close(this.selectedCategory);
  }
}
