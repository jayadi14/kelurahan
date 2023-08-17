import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcFilterDialogModule } from '@shared/components/fc-filter-dialog/fc-filter-dialog.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { FcSelectOptionModule } from '@shared/components/fc-select-option/fc-select-option.module';
import { SharedModule } from '@shared/shared.module';
import { PurchaseRequestAddDialogComponent } from './components/purchase-request-add-dialog/purchase-request-add-dialog.component';
import { PurchaseRequestEditDialogComponent } from './components/purchase-request-edit-dialog/purchase-request-edit-dialog.component';
import { PurchaseRequestAddComponent } from './pages/purchase-request-add/purchase-request-add.component';
import { PurchaseRequestListComponent } from './pages/purchase-request-list/purchase-request-list.component';
import { PurchaseRequestViewComponent } from './pages/purchase-request-view/purchase-request-view.component';
import { PurchaseRequestRoutingModule } from './purchase-request-routing.module';
import { PurchaseRequestComponent } from './purchase-request.component';

@NgModule({
  declarations: [
    PurchaseRequestComponent,
    PurchaseRequestListComponent,
    PurchaseRequestAddComponent,
    PurchaseRequestViewComponent,
    PurchaseRequestAddDialogComponent,
    PurchaseRequestEditDialogComponent,
  ],
  imports: [
    CommonModule,
    PurchaseRequestRoutingModule,
    SharedModule,
    FcInputTextModule,
    FcInputNumberModule,
    FcDatepickerModule,
    FcSelectOptionModule,
    FcPaginationModule,
    FcImagePreviewModule,
    FcFilterDialogModule,
  ],
})
export class PurchaseRequestModule {}
