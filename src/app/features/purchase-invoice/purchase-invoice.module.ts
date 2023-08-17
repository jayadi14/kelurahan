import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcFilterDialogModule } from '@shared/components/fc-filter-dialog/fc-filter-dialog.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { PurchaseInvoiceDetailAddDialogComponent } from './components/purchase-invoice-detail-add-dialog/purchase-invoice-detail-add-dialog.component';
import { PurchaseInvoiceDetailEditDialogComponent } from './components/purchase-invoice-detail-edit-dialog/purchase-invoice-detail-edit-dialog.component';
import { PurchaseInvoiceDetailSelectDialogComponent } from './components/purchase-invoice-detail-select-dialog/purchase-invoice-detail-select-dialog.component';
import { PurchaseInvoiceDetailComponent } from './components/purchase-invoice-detail/purchase-invoice-detail.component';
import { PurchaseInvoiceSelectDialogComponent } from './components/purchase-invoice-select-dialog/purchase-invoice-select-dialog.component';
import { PurchaseInvoiceAddComponent } from './pages/purchase-invoice-add/purchase-invoice-add.component';
import { PurchaseInvoiceListComponent } from './pages/purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseInvoiceViewComponent } from './pages/purchase-invoice-view/purchase-invoice-view.component';
import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice.component';

@NgModule({
  declarations: [
    PurchaseInvoiceComponent,
    PurchaseInvoiceAddComponent,
    PurchaseInvoiceViewComponent,
    PurchaseInvoiceListComponent,
    PurchaseInvoiceDetailAddDialogComponent,
    PurchaseInvoiceDetailEditDialogComponent,
    PurchaseInvoiceDetailComponent,
    PurchaseInvoiceSelectDialogComponent,
    PurchaseInvoiceDetailSelectDialogComponent,
  ],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcInputTextModule,
    FcInputNumberModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcFilterDialogModule,
  ],
})
export class PurchaseInvoiceModule {}
