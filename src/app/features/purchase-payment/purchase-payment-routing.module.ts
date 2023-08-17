import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasePaymentAddComponent } from './pages/purchase-payment-add/purchase-payment-add.component';
import { PurchasePaymentListComponent } from './pages/purchase-payment-list/purchase-payment-list.component';
import { PurchasePaymentViewComponent } from './pages/purchase-payment-view/purchase-payment-view.component';
import { PurchasePaymentComponent } from './purchase-payment.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasePaymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PurchasePaymentListComponent,
      },
      {
        path: 'add',
        component: PurchasePaymentAddComponent,
      },
      {
        path: 'view/:id',
        component: PurchasePaymentViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasePaymentRoutingModule {}
