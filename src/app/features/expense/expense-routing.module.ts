import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './expense.component';
import { ExpenseAddComponent } from './pages/expense-add/expense-add.component';
import { ExpenseListComponent } from './pages/expense-list/expense-list.component';
import { ExpenseViewComponent } from './pages/expense-view/expense-view.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ExpenseListComponent,
      },
      {
        path: 'view/:id',
        component: ExpenseViewComponent,
      },
      {
        path: 'add',
        component: ExpenseAddComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
