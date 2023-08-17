import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierAddComponent } from './pages/supplier-add/supplier-add.component';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierViewComponent } from './pages/supplier-view/supplier-view.component';
import { SupplierComponent } from './supplier.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SupplierListComponent,
      },
      {
        path: 'add',
        component: SupplierAddComponent,
      },
      {
        path: 'view/:supplierId',
        component: SupplierViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {}
