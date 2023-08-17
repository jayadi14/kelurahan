import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDropdownModule,
  ],
})
export class DashboardModule {}
