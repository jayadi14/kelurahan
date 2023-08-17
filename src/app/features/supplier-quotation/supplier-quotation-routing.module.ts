import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierQuotationAddComponent } from './pages/supplier-quotation-add/supplier-quotation-add.component';
import { SupplierQuotationListComponent } from './pages/supplier-quotation-list/supplier-quotation-list.component';
import { SupplierQuotationViewComponent } from './pages/supplier-quotation-view/supplier-quotation-view.component';
import { SupplierQuotationComponent } from './supplier-quotation.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierQuotationComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SupplierQuotationListComponent,
      },
      {
        path: 'add',
        component: SupplierQuotationAddComponent,
      },
      {
        path: 'view/:id',
        component: SupplierQuotationViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierQuotationRoutingModule {}
