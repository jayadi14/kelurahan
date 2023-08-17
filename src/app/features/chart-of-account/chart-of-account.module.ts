import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChartOfAccountRoutingModule } from './chart-of-account-routing.module';
import { ChartOfAccountComponent } from './chart-of-account.component';
import { ChartOfAccountListComponent } from './pages/chart-of-account-list/chart-of-account-list.component';

@NgModule({
  declarations: [ChartOfAccountComponent, ChartOfAccountListComponent],
  imports: [CommonModule, ChartOfAccountRoutingModule, SharedModule],
})
export class ChartOfAccountModule {}
