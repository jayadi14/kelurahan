import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderAddComponent } from './pages/purchase-order-add/purchase-order-add.component';
import { PurchaseOrderListComponent } from './pages/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderViewComponent } from './pages/purchase-order-view/purchase-order-view.component';
import { PurchaseOrderComponent } from './purchase-order.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PurchaseOrderListComponent,
      },
      {
        path: 'add',
        component: PurchaseOrderAddComponent,
      },
      {
        path: 'view/:id',
        component: PurchaseOrderViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrderRoutingModule {}
