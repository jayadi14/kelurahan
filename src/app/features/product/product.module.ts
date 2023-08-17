import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcFileInputModule } from '@shared/components/fc-file-input/fc-file-input.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { ProductAddComponent } from './pages/product-add/product-add.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { ProductSelectDialogComponent } from './components/product-select-dialog/product-select-dialog.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    ProductViewComponent,
    ProductAddComponent,
    ProductSelectDialogComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcFileInputModule,
    FcInputNumberModule,
    FcImagePreviewModule,
  ],
  exports: [
    ProductSelectDialogComponent
  ]
})
export class ProductModule {}
