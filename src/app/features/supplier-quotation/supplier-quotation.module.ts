import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcFilterDialogModule } from '@shared/components/fc-filter-dialog/fc-filter-dialog.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { SupplierQuotationDetailAddDialogComponent } from './components/supplier-quotation-detail-add-dialog/supplier-quotation-detail-add-dialog.component';
import { SupplierQuotationDetailEditDialogComponent } from './components/supplier-quotation-detail-edit-dialog/supplier-quotation-detail-edit-dialog.component';
import { SupplierQuotationAddComponent } from './pages/supplier-quotation-add/supplier-quotation-add.component';
import { SupplierQuotationListComponent } from './pages/supplier-quotation-list/supplier-quotation-list.component';
import { SupplierQuotationViewComponent } from './pages/supplier-quotation-view/supplier-quotation-view.component';
import { SupplierQuotationRoutingModule } from './supplier-quotation-routing.module';
import { SupplierQuotationComponent } from './supplier-quotation.component';
import { SupplierQuotationSelectDetailDialogComponent } from './components/supplier-quotation-select-detail-dialog/supplier-quotation-select-detail-dialog.component';
import { SupplierQuotationSelectDialogComponent } from './components/supplier-quotation-select-dialog/supplier-quotation-select-dialog.component';

@NgModule({
  declarations: [
    SupplierQuotationComponent,
    SupplierQuotationAddComponent,
    SupplierQuotationListComponent,
    SupplierQuotationViewComponent,
    SupplierQuotationDetailEditDialogComponent,
    SupplierQuotationDetailAddDialogComponent,
    SupplierQuotationSelectDetailDialogComponent,
    SupplierQuotationSelectDialogComponent,
  ],
  imports: [
    CommonModule,
    SupplierQuotationRoutingModule,
    SharedModule,
    FcDatepickerModule,
    FcInputTextModule,
    FcInputNumberModule,
    FcPaginationModule,
    FcImagePreviewModule,
    FcFilterDialogModule,
  ],
})
export class SupplierQuotationModule {}
