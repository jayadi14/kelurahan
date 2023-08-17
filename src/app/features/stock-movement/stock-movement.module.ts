import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockMovementRoutingModule } from './stock-movement-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcImagePreviewModule } from '@shared/components/fc-image-preview/fc-image-preview.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { StockMovementComponent } from './stock-movement.component';
import { StockMovementListComponent } from './pages/stock-movement-list/stock-movement-list.component';
import { StockMovementAddComponent } from './pages/stock-movement-add/stock-movement-add.component';
import { StockMovementViewComponent } from './pages/stock-movement-view/stock-movement-view.component';


@NgModule({
  declarations: [
  
    StockMovementComponent,
       StockMovementListComponent,
       StockMovementAddComponent,
       StockMovementViewComponent
  ],
  imports: [
    CommonModule,
    StockMovementRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDatepickerModule,
    FcImagePreviewModule,
    FcInputTextModule,
    FcInputNumberModule,
  ],
  exports:[
  ]
})
export class StockMovementModule { }
