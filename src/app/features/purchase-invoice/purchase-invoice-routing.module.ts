import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseInvoiceAddComponent } from './pages/purchase-invoice-add/purchase-invoice-add.component';
import { PurchaseInvoiceListComponent } from './pages/purchase-invoice-list/purchase-invoice-list.component';
import { PurchaseInvoiceViewComponent } from './pages/purchase-invoice-view/purchase-invoice-view.component';
import { PurchaseInvoiceComponent } from './purchase-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseInvoiceComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PurchaseInvoiceListComponent,
      },
      {
        path: 'add',
        component: PurchaseInvoiceAddComponent,
      },
      {
        path: 'view/:id',
        component: PurchaseInvoiceViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseInvoiceRoutingModule {}
