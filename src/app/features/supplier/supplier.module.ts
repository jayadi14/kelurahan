import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { SupplierBankAccountAddDialogComponent } from './components/supplier-bank-account-add-dialog/supplier-bank-account-add-dialog.component';
import { SupplierSelectDialogComponent } from './components/supplier-select-dialog/supplier-select-dialog.component';
import { SupplierAddComponent } from './pages/supplier-add/supplier-add.component';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierViewComponent } from './pages/supplier-view/supplier-view.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { SupplierBankAccountEditDialogComponent } from './components/supplier-bank-account-edit-dialog/supplier-bank-account-edit-dialog.component';

@NgModule({
  declarations: [
    SupplierComponent,
    SupplierAddComponent,
    SupplierViewComponent,
    SupplierListComponent,
    SupplierSelectDialogComponent,
    SupplierBankAccountAddDialogComponent,
    SupplierBankAccountEditDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SupplierRoutingModule,
    FcPaginationModule,
    FcInputTextModule,
  ],
  exports: [SupplierSelectDialogComponent],
})
export class SupplierModule {}
