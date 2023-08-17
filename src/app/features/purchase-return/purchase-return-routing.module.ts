import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseReturnComponent } from './purchase-return.component';
import { PurchaseReturnListComponent } from './pages/purchase-return-list/purchase-return-list.component';
import { PurchaseReturnAddComponent } from './pages/purchase-return-add/purchase-return-add.component';
import { PurchaseReturnViewComponent } from './pages/purchase-return-view/purchase-return-view.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseReturnComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PurchaseReturnListComponent,
      },
      {
        path: 'add',
        component: PurchaseReturnAddComponent,
      },
      {
        path: 'view/:id',
        component: PurchaseReturnViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReturnRoutingModule { }
