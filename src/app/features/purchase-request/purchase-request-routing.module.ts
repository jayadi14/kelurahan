import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseRequestAddComponent } from './pages/purchase-request-add/purchase-request-add.component';
import { PurchaseRequestListComponent } from './pages/purchase-request-list/purchase-request-list.component';
import { PurchaseRequestViewComponent } from './pages/purchase-request-view/purchase-request-view.component';
import { PurchaseRequestComponent } from './purchase-request.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseRequestComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: PurchaseRequestListComponent,
      },
      {
        path: 'add',
        component: PurchaseRequestAddComponent,
      },
      {
        path: 'view/:id',
        component: PurchaseRequestViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRequestRoutingModule {}
