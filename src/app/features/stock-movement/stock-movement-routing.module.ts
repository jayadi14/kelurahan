import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockMovementComponent } from './stock-movement.component';
import { StockMovementListComponent } from './pages/stock-movement-list/stock-movement-list.component';
import { StockMovementAddComponent } from './pages/stock-movement-add/stock-movement-add.component';
import { StockMovementViewComponent } from './pages/stock-movement-view/stock-movement-view.component';

const routes: Routes = [
  {
    path: '',
    component: StockMovementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: StockMovementListComponent,
      },
      {
        path: 'add',
        component: StockMovementAddComponent,
      },
      {
        path: 'view/:id',
        component: StockMovementViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockMovementRoutingModule { }
