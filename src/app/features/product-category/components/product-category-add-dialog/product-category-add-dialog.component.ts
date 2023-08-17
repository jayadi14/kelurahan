import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategoryService } from '@features/product-category/services/product-category.service';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-category-add-dialog',
  templateUrl: './product-category-add-dialog.component.html',
  styleUrls: ['./product-category-add-dialog.component.css'],
})
export class ProductCategoryAddDialogComponent {
  private destroy$: any = new Subject();

  faTimes = faTimes;
  faSpinner = faSpinner;

  title = 'Add Product Category';
  productCategory: any = {};
  productCategoryForm: FormGroup;
  loading = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productCategoryService: ProductCategoryService
  ) {
    if (this.config.data.productCategory) {
      this.productCategory = this.config.data.productCategory;
    }
    if (this.config.data.title) {
      this.title = this.config.data.title;
    }
    this.productCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      category_parent_id: new FormControl(this.productCategory.id || null),
    });
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {}

  onClose() {
    this.ref.close();
  }
  submit() {
    this.loading = true;
    this.productCategoryService
      .addProductCategory(this.productCategoryForm.value)
      .subscribe((res: any) => {
        this.ref.close(res.data);
      });
  }
}
