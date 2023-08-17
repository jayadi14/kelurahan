import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseReturnRoutingModule } from './purchase-return-routing.module';
import { PurchaseReturnComponent } from './purchase-return.component';
import { PurchaseReturnListComponent } from './pages/purchase-return-list/purchase-return-list.component';
import { PurchaseReturnAddComponent } from './pages/purchase-return-add/purchase-return-add.component';
import { PurchaseReturnViewComponent } from './pages/purchase-return-view/purchase-return-view.component';
import { SharedModule } from '@shared/shared.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { PurchaseReturnAddDetailDialogComponent } from './components/purchase-return-add-detail-dialog/purchase-return-add-detail-dialog.component';
import { PurchaseReturnEditDetailDialogComponent } from './components/purchase-return-edit-detail-dialog/purchase-return-edit-detail-dialog.component';


@NgModule({
  declarations: [
    PurchaseReturnComponent,
    PurchaseReturnListComponent,
    PurchaseReturnAddComponent,
    PurchaseReturnViewComponent,
    PurchaseReturnAddDetailDialogComponent,
    PurchaseReturnEditDetailDialogComponent
  ],
  imports: [
    CommonModule,
    PurchaseReturnRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcInputTextModule,
    FcInputNumberModule,
  ]
})
export class PurchaseReturnModule { }
