import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { StaffViewComponent } from './pages/staff-view/staff-view.component';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { StaffAddComponent } from './pages/staff-add/staff-add.component';

@NgModule({
  declarations: [
    StaffComponent,
    StaffListComponent,
    StaffViewComponent,
    StaffAddComponent,
  ],
  imports: [CommonModule, StaffRoutingModule, SharedModule, FcPaginationModule],
})
export class StaffModule {}
