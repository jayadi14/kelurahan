import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartOfAccountComponent } from './chart-of-account.component';
import { ChartOfAccountListComponent } from './pages/chart-of-account-list/chart-of-account-list.component';

const routes: Routes = [
  {
    path: '',
    component: ChartOfAccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ChartOfAccountListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartOfAccountRoutingModule {}
