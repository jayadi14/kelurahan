import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { BrandListComponent } from './pages/brand-list/brand-list.component';
import { BrandViewComponent } from './pages/brand-view/brand-view.component';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { BrandSelectDialogComponent } from './components/brand-select-dialog/brand-select-dialog.component';

@NgModule({
  declarations: [
    BrandComponent,
    BrandAddComponent,
    BrandViewComponent,
    BrandListComponent,
    BrandSelectDialogComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    SharedModule,
    FcPaginationModule,
  ],
  exports: [
    BrandSelectDialogComponent
  ]
})
export class BrandModule {}
