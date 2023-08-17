import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoodsReceiptRoutingModule } from './goods-receipt-routing.module';
import { GoodsReceiptComponent } from './goods-receipt.component';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { SharedModule } from '@shared/shared.module';
import { GoodsReceiptListComponent } from './pages/goods-receipt-list/goods-receipt-list.component';
import { GoodsReceiptAddComponent } from './pages/goods-receipt-add/goods-receipt-add.component';
import { GoodsReceiptViewComponent } from './pages/goods-receipt-view/goods-receipt-view.component';
import { GoodsReceiptDetailEditDialogComponent } from './components/goods-receipt-detail-edit-dialog/goods-receipt-detail-edit-dialog.component';
import { GoodsReceiptDetailAddDialogComponent } from './components/goods-receipt-detail-add-dialog/goods-receipt-detail-add-dialog.component';
import { GoodsReceiptDetailSelectDialogComponent } from './components/goods-receipt-detail-select-dialog/goods-receipt-detail-select-dialog.component';


@NgModule({
  declarations: [
    GoodsReceiptComponent,
    GoodsReceiptListComponent,
    GoodsReceiptAddComponent,
    GoodsReceiptViewComponent,
    GoodsReceiptDetailEditDialogComponent,
    GoodsReceiptDetailAddDialogComponent,
    GoodsReceiptDetailSelectDialogComponent
  ],
  imports: [
    CommonModule,
    GoodsReceiptRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcInputTextModule,
    FcInputNumberModule,
  ]
})
export class GoodsReceiptModule { }
