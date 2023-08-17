import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { PurchaseOrderAddComponent } from './pages/purchase-order-add/purchase-order-add.component';
import { PurchaseOrderListComponent } from './pages/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderViewComponent } from './pages/purchase-order-view/purchase-order-view.component';
import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { PurchaseOrderAddDetailComponent } from './components/purchase-order-add-detail/purchase-order-add-detail.component';
import { PurchaseOrderSelectDialogComponent } from './components/purchase-order-select-dialog/purchase-order-select-dialog.component';
import { PurchaseOrderEditDetailComponent } from './components/purchase-order-edit-detail/purchase-order-edit-detail.component';
import { PurchaseOrderWarehouseAddDialogComponent } from './components/purchase-order-warehouse-add-dialog/purchase-order-warehouse-add-dialog.component';
import { PurchaseOrderWarehouseEditDialogComponent } from './components/purchase-order-warehouse-edit-dialog/purchase-order-warehouse-edit-dialog.component';
import { PurchaseOrderWizardDialogComponent } from './components/purchase-order-wizard-dialog/purchase-order-wizard-dialog.component';

@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PurchaseOrderAddComponent,
    PurchaseOrderViewComponent,
    PurchaseOrderListComponent,
    PurchaseOrderAddDetailComponent,
    PurchaseOrderSelectDialogComponent,
    PurchaseOrderEditDetailComponent,
    PurchaseOrderWarehouseAddDialogComponent,
    PurchaseOrderWarehouseEditDialogComponent,
    PurchaseOrderWizardDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PurchaseOrderRoutingModule,
    FcPaginationModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcInputTextModule,
    FcInputNumberModule,
  ],
})
export class PurchaseOrderModule {}
