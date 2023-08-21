import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcPaginationModule } from 'src/app/shared/components/fc-pagination/fc-pagination.module';
import { FcDropdownModule } from 'src/app/shared/components/fc-dropdown/fc-dropdown.module';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UsersAddComponent } from './pages/users-add/users-add.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UsersAddComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDropdownModule,
  ]
})
export class UsersModule { }
