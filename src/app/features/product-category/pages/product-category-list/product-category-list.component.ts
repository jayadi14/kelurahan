import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategoryAddDialogComponent } from '@features/product-category/components/product-category-add-dialog/product-category-add-dialog.component';
import { ProductCategoryEditDialogComponent } from '@features/product-category/components/product-category-edit-dialog/product-category-edit-dialog.component';
import { ProductCategory } from '@features/product-category/interfaces/product-category';
import { ProductCategoryService } from '@features/product-category/services/product-category.service';
import {
  faChevronLeft,
  faEye,
  faFilter,
  faLocationDot,
  faPencil,
  faPhone,
  faPlus,
  faRefresh,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FcFilterConfig } from '@shared/components/fc-filter-dialog/interfaces/fc-filter-config';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.css'],
})
export class ProductCategoryListComponent {
  private readonly destroy$ = new Subject<void>();
  faLocationDot = faLocationDot;
  faUser = faUser;
  faPhone = faPhone;
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;

  quickView = false;

  actionButtons: any[] = [
    {
      label: 'Add',
      icon: faPlus,
      action: () => {
        this.onAddCategory();
      },
    },
  ];
  filterButtons: any[] = [
    {
      label: 'Refresh',
      icon: faRefresh,
      action: () => {
        this.loadData();
      },
    },
    {
      label: 'Filter',
      icon: faFilter,
      action: () => {},
    },
  ];
  fcFilterConfig: FcFilterConfig = {
    filterFields: [],
    sort: {
      fields: [
        { name: 'name', header: 'Nama' },
        { name: 'email', header: 'Email' },
      ],
      selectedField: 'id',
      direction: 'desc',
    },
  };
  loading: boolean = false;
  totalRecords = 0;
  totalPages = 1;
  page = 1;
  rows = 10;
  searchQuery: string = '';

  productCategories: ProductCategory[] = [];
  selectedProductCategory: ProductCategory | undefined;

  constructor(
    private layoutService: LayoutService,
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Product Categories',
      icon: '',
      showHeader: true,
    });
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.layoutService.setSearchConfig({
          featureName: 'Product Category',
          disabled: true,
        });
      });
  }
  ngOnInit(): void {
    // initial load Data
    this.loadData();
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.layoutService.setSearchConfig({
      featureName: 'Product Category',
      disabled: false,
    });
  }
  loadData() {
    this.loading = true;
    this.productCategoryService.getProductCategories().subscribe((res: any) => {
      let data = res.data.product_categories;
      this.handleProductCategories(data);
      this.loading = false;
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
  }

  onChangeProductCategory(productCategory: ProductCategory) {
    this.selectedProductCategory = productCategory;
  }
  onAddCategory(productCategory: ProductCategory | undefined = undefined) {
    const ref = this.dialogService.open(ProductCategoryAddDialogComponent, {
      data: {
        title: 'Add Category',
        productCategory: productCategory,
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
    });
    ref.onClose.subscribe((newData) => {
      if (newData) {
        newData.subcategories = [];
        // check if has parent
        if (newData.category_parent_id) {
          // add to sub categories
          this.addSubcategory(newData);
        } else {
          // add to product categories
          this.addCategory(newData);
        }
      }
    });
  }
  addCategory(productCategory: ProductCategory) {
    this.productCategories.push(productCategory);
  }
  addSubcategory(newProductCategory: ProductCategory) {
    this.productCategories.forEach((productCategory: ProductCategory) => {
      if (productCategory.id === newProductCategory.category_parent_id) {
        productCategory.subcategories.push(newProductCategory);
      } else {
        if (productCategory.subcategories.length > 0) {
          productCategory.subcategories.forEach(
            (subCategory: ProductCategory) => {
              if (subCategory.id === newProductCategory.category_parent_id) {
                subCategory.subcategories.push(newProductCategory);
              }
            }
          );
        }
      }
    });
  }
  onEditProductCategory(productCategory: ProductCategory) {
    const ref = this.dialogService.open(ProductCategoryEditDialogComponent, {
      data: {
        title: 'Edit Category',
        productCategory: productCategory,
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
    });
    ref.onClose.subscribe((updatedData) => {
      if (updatedData) {
        // check if has parent
        if (updatedData.category_parent_id) {
          // update to sub categories
          this.updateSubCategories(updatedData);
        } else {
          // update to product categories
          this.updateProductCategories(updatedData);
        }
      }
    });
  }
  updateProductCategories(updatedProductCategory: ProductCategory) {
    this.productCategories.forEach((productCategory: ProductCategory) => {
      if (productCategory.id === updatedProductCategory.id) {
        productCategory.name = updatedProductCategory.name;
      } else {
        if (productCategory.subcategories.length > 0) {
          // is has parent
          productCategory.subcategories.forEach(
            (subCategory: ProductCategory) => {
              if (subCategory.id === updatedProductCategory.id) {
                subCategory.name = updatedProductCategory.name;
              }
            }
          );
        }
      }
    });
  }
  updateSubCategories(updatedProductCategory: ProductCategory) {
    this.productCategories.forEach((productCategory: ProductCategory) => {
      if (productCategory.id === updatedProductCategory.category_parent_id) {
        productCategory.subcategories.forEach(
          (subCategory: ProductCategory) => {
            if (subCategory.id === updatedProductCategory.id) {
              subCategory.name = updatedProductCategory.name;
            }
          }
        );
      } else {
        if (productCategory.subcategories.length > 0) {
          productCategory.subcategories.forEach(
            (subCategory: ProductCategory) => {
              if (
                subCategory.id === updatedProductCategory.category_parent_id
              ) {
                subCategory.subcategories.forEach(
                  (subCategoryItem: ProductCategory) => {
                    if (subCategoryItem.id === updatedProductCategory.id) {
                      subCategoryItem.name = updatedProductCategory.name;
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  }
  deleteProductCategory(productCategory: ProductCategory) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this product category?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.productCategoryService
          .deleteProductCategory(productCategory.id)
          .subscribe((res) => {
            if (productCategory.category_parent_id) {
              this.productCategories.forEach(
                (productCategoryItem: ProductCategory) => {
                  if (
                    productCategoryItem.id ===
                    productCategory.category_parent_id
                  ) {
                    let deletedIndex =
                      productCategoryItem.subcategories.findIndex(
                        (subCategory: ProductCategory) =>
                          subCategory.id === productCategory.id
                      );
                    productCategoryItem.subcategories.splice(deletedIndex, 1);
                  } else {
                    if (productCategoryItem.subcategories.length > 0) {
                      // is has parent
                      productCategoryItem.subcategories.forEach(
                        (subCategory: ProductCategory) => {
                          if (
                            subCategory.id ===
                            productCategory.category_parent_id
                          ) {
                            let deletedIndex =
                              subCategory.subcategories.findIndex(
                                (subCategory: ProductCategory) =>
                                  subCategory.id === productCategory.id
                              );
                            subCategory.subcategories.splice(deletedIndex, 1);
                          }
                        }
                      );
                    }
                  }
                }
              );
            } else {
              let deletedIndex = this.productCategories.findIndex(
                (productCategoryItem: ProductCategory) =>
                  productCategoryItem.id === productCategory.id
              );
              this.productCategories.splice(deletedIndex, 1);
            }
          });
      },
      key: 'confirmDialog',
    });
  }
  navigateToDetail(productCategory: ProductCategory) {
    this.router.navigate(['/product-category/view/', productCategory.id]);
  }
}
