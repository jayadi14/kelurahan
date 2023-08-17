import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { SharedModule } from '@shared/shared.module';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyViewComponent } from './pages/company-view/company-view.component';
import { CompanyAddComponent } from './pages/company-add/company-add.component';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { BusinessUnitSelectDialogComponent } from './components/business-unit-select-dialog/business-unit-select-dialog.component';
import { CompanyAddDialogComponent } from './components/company-add-dialog/company-add-dialog.component';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyListComponent,
    CompanyViewComponent,
    CompanyAddComponent,
    CompanyAddDialogComponent,
    BusinessUnitSelectDialogComponent,
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule,
    FcPaginationModule,
  ],
  exports: [
    BusinessUnitSelectDialogComponent,
    CompanyAddDialogComponent
  ]
})
export class CompanyModule {}
