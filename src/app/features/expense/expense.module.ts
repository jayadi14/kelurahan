import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { ExpenseAddComponent } from './pages/expense-add/expense-add.component';
import { ExpenseListComponent } from './pages/expense-list/expense-list.component';
import { ExpenseViewComponent } from './pages/expense-view/expense-view.component';

@NgModule({
  declarations: [
    ExpenseComponent,
    ExpenseListComponent,
    ExpenseViewComponent,
    ExpenseAddComponent,
  ],
  imports: [CommonModule, ExpenseRoutingModule, SharedModule],
})
export class ExpenseModule {}
