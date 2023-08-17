import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyListComponent } from './pages/currency-list/currency-list.component';
import { CurrencyComponent } from './currency.component';
import { CurrencyAddComponent } from './pages/currency-add/currency-add.component';
import { CurrencyViewComponent } from './pages/currency-view/currency-view.component';

const routes: Routes = [
  {
    path: '',
    component: CurrencyComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CurrencyListComponent,
      },
      {
        path: 'add',
        component: CurrencyAddComponent,
      },
      {
        path: 'view/:id',
        component: CurrencyViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
