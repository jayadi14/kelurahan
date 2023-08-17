import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { CustomerAddComponent } from './pages/customer-add/customer-add.component';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerViewComponent } from './pages/customer-view/customer-view.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CustomerListComponent,
      },
      {
        path: 'add',
        component: CustomerAddComponent,
      },
      {
        path: 'view/:customerId',
        component: CustomerViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
