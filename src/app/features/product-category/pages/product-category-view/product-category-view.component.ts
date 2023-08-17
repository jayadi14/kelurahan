import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategory } from '@features/product-category/interfaces/product-category';
import { ProductCategoryService } from '@features/product-category/services/product-category.service';
import { Product } from '@features/product/interfaces/product.interface';
import { ProductService } from '@features/product/services/product.service';
import {
  faEye,
  faPencil,
  faPlus,
  faRefresh,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcConfirmService } from '@shared/components/fc-confirm/fc-confirm.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';

@Component({
  selector: 'app-product-category-view',
  templateUrl: './product-category-view.component.html',
  styleUrls: ['./product-category-view.component.css'],
})
export class ProductCategoryViewComponent {
  private destroy$: any = new Subject();
  faPencil = faPencil;
  faPlus = faPlus;
  faTrash = faTrash;
  faEye = faEye;

  actionButtons: any[] = [
    {
      label: 'Save',
      icon: faSave,
      action: () => {
        this.submit();
      },
    },
    {
      label: 'Delete',
      icon: faTrash,
      action: () => {
        this.onDeleteProductCategory();
      },
    },
  ];
  hiddenActionButtons: any[] = [];
  filterButtons: any[] = [
    {
      label: '',
      icon: faRefresh,
      action: () => {
        this.loadData();
      },
    },
  ];

  productCategory: ProductCategory = {} as ProductCategory;
  products: Product[] = [];
  productsLoading = true;

  productCategoryForm: FormGroup;
  loading = false;

  constructor(
    private layoutService: LayoutService,
    private location: Location,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private fcConfirmService: FcConfirmService,
    private fcToastService: FcToastService
  ) {
    this.layoutService.setHeaderConfig({
      title: 'Product Category Detail',
      icon: '',
      showHeader: true,
    });
    this.productCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      category_parent_id: new FormControl(''),
    });
    this.productCategory.id = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.productsLoading = true;
    this.productCategoryService
      .getProductCategory(this.productCategory.id)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.productCategory = res.data;
          this.productCategoryForm.patchValue(this.productCategory);
          this.loadProduct();
        },
        error: (err: any) => {
          this.loading = false;
          this.productsLoading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Product Category',
            message: err.message,
          });
        },
      });
  }
  loadProduct() {
    let param = `with_filter=1&products-product_category_id=${this.productCategory.id}`;
    this.productService.getProductsByProductCategory(param).subscribe({
      next: (res: any) => {
        this.productsLoading = false;
        this.products = res.data.products;
        this.products.forEach((product) => {
          product.default_image = product.product_images.find(
            (image: any) => image.is_default == 1
          );
        });
      },
      error: (err: any) => {
        this.productsLoading = false;
      },
    });
  }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}
  onDeleteProductCategory() {
    this.fcConfirmService.open({
      header: 'Delete Product Category',
      message: 'Are you sure to delete this product category?',
      accept: () => {
        this.deleteProductCategory();
      },
    });
  }
  deleteProductCategory() {
    this.actionButtons[1].loading = true;
    this.productCategoryService
      .deleteProductCategory(this.productCategory.id)
      .subscribe({
        next: (res: any) => {
          this.actionButtons[1].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Product Category',
            message: res.message,
          });
          this.back();
        },
        error: (err: any) => {
          this.actionButtons[1].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Product Category',
            message: err.message,
          });
        },
      });
  }

  navigateToProductDetail(id: string) {
    this.router.navigate(['/product/view', id]);
  }

  submit() {
    this.actionButtons[0].loading = true;
    this.productCategoryService
      .updateProductCategory(
        this.productCategory.id,
        this.productCategoryForm.value
      )
      .subscribe({
        next: (res: any) => {
          this.productCategory = res.data;
          this.productCategoryForm.patchValue(this.productCategory);
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'success',
            header: 'Product Category',
            message: res.message,
          });
        },
        error: (err: any) => {
          this.actionButtons[0].loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Product Category',
            message: err.message,
          });
        },
      });
  }
  back() {
    this.location.back();
  }
}
