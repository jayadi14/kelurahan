import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { ProductCategoryAddDialogComponent } from './components/product-category-add-dialog/product-category-add-dialog.component';
import { ProductCategoryEditDialogComponent } from './components/product-category-edit-dialog/product-category-edit-dialog.component';
import { ProductCategoryListComponent } from './pages/product-category-list/product-category-list.component';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { ProductCategoryComponent } from './product-category.component';
import { ProductCategoryViewComponent } from './pages/product-category-view/product-category-view.component';
import { ProductCategorySelectDialogComponent } from './components/product-category-select-dialog/product-category-select-dialog.component';

@NgModule({
  declarations: [
    ProductCategoryComponent,
    ProductCategoryListComponent,
    ProductCategoryAddDialogComponent,
    ProductCategoryEditDialogComponent,
    ProductCategoryViewComponent,
    ProductCategorySelectDialogComponent
  ],
  imports: [
    CommonModule,
    ProductCategoryRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcInputNumberModule,
  ],
  exports:[
    ProductCategorySelectDialogComponent
  ]
})
export class ProductCategoryModule {}
