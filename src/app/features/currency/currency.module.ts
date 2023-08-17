import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { CurrencyExchangeRateAddDialogComponent } from './components/currency-exchange-rate-add-dialog/currency-exchange-rate-add-dialog.component';
import { CurrencyExchangeRateEditDialogComponent } from './components/currency-exchange-rate-edit-dialog/currency-exchange-rate-edit-dialog.component';
import { CurrencyRoutingModule } from './currency-routing.module';
import { CurrencyComponent } from './currency.component';
import { CurrencyAddComponent } from './pages/currency-add/currency-add.component';
import { CurrencyListComponent } from './pages/currency-list/currency-list.component';
import { CurrencyViewComponent } from './pages/currency-view/currency-view.component';

@NgModule({
  declarations: [
    CurrencyComponent,
    CurrencyListComponent,
    CurrencyViewComponent,
    CurrencyAddComponent,
    CurrencyExchangeRateAddDialogComponent,
    CurrencyExchangeRateEditDialogComponent,
  ],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    SharedModule,
    FcPaginationModule,
    FcDatepickerModule,
  ],
})
export class CurrencyModule {}
