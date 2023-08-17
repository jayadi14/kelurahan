import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { SharedModule } from '@shared/shared.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './pages/warehouse-add/warehouse-add.component';
import { WarehouseViewComponent } from './pages/warehouse-view/warehouse-view.component';
import { WarehouseSelectDialogComponent } from './components/warehouse-select-dialog/warehouse-select-dialog.component';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { InventoryModule } from '@features/inventory/inventory.module';

@NgModule({
  declarations: [
    WarehouseComponent,
    WarehouseListComponent,
    WarehouseAddComponent,
    WarehouseViewComponent,
    WarehouseSelectDialogComponent
  ],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    InventoryModule,
    SharedModule,
    FcPaginationModule,
    FcImagePreviewModule,
  ],
  exports: [
    WarehouseSelectDialogComponent
  ]
})
export class WarehouseModule { }
