import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './pages/warehouse-add/warehouse-add.component';
import { WarehouseViewComponent } from './pages/warehouse-view/warehouse-view.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: WarehouseListComponent,
      },
      {
        path: 'add',
        component: WarehouseAddComponent,
      },
      {
        path: 'view/:id',
        component: WarehouseViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
