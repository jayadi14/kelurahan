import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategoryService } from '@features/product-category/services/product-category.service';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-category-edit-dialog',
  templateUrl: './product-category-edit-dialog.component.html',
  styleUrls: ['./product-category-edit-dialog.component.css'],
})
export class ProductCategoryEditDialogComponent {
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
      name: new FormControl(this.productCategory.name, Validators.required),
      category_parent_id: new FormControl(
        this.productCategory.category_parent_id || null
      ),
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
      .updateProductCategory(
        this.productCategory.id,
        this.productCategoryForm.value
      )
      .subscribe((res: any) => {
        this.ref.close(res.data);
      });
  }
}
