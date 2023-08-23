import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { StaffViewComponent } from './pages/staff-view/staff-view.component';
import { StaffAddComponent } from './pages/staff-add/staff-add.component';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';

@NgModule({
  declarations: [
    StaffComponent,
    StaffListComponent,
    StaffViewComponent,
    StaffAddComponent,
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcInputTextModule,
    FcDropdownModule,
    FcDatepickerModule,
    FcInputNumberModule,
  ],
})
export class StaffModule {}
