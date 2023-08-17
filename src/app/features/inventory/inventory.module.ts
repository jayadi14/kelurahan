import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryTransactionsDialogComponent } from './components/inventory-transactions-dialog/inventory-transactions-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { InventorySelectDialogComponent } from './components/inventory-select-dialog/inventory-select-dialog.component';


@NgModule({
  declarations: [
    InventoryTransactionsDialogComponent,
    InventorySelectDialogComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcInputTextModule,
    FcInputNumberModule,
  ],
  exports:[
    InventoryTransactionsDialogComponent
  ]
})
export class InventoryModule { }
