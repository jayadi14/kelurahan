import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffAddComponent } from './pages/staff-add/staff-add.component';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { StaffViewComponent } from './pages/staff-view/staff-view.component';
import { StaffComponent } from './staff.component';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: StaffListComponent,
      },
      {
        path: 'add',
        component: StaffAddComponent,
      },
      {
        path: 'view/:staffId',
        component: StaffViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
