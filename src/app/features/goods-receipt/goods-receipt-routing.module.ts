import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsReceiptComponent } from './goods-receipt.component';
import { GoodsReceiptListComponent } from './pages/goods-receipt-list/goods-receipt-list.component';
import { GoodsReceiptAddComponent } from './pages/goods-receipt-add/goods-receipt-add.component';
import { GoodsReceiptViewComponent } from './pages/goods-receipt-view/goods-receipt-view.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsReceiptComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: GoodsReceiptListComponent,
      },
      {
        path: 'add',
        component: GoodsReceiptAddComponent,
      },
      {
        path: 'view/:id',
        component: GoodsReceiptViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsReceiptRoutingModule { }
