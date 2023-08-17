import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { PurchasePaymentDetailAddDialogComponent } from './components/purchase-payment-detail-add-dialog/purchase-payment-detail-add-dialog.component';
import { PurchasePaymentDetailEditDialogComponent } from './components/purchase-payment-detail-edit-dialog/purchase-payment-detail-edit-dialog.component';
import { PurchasePaymentAddComponent } from './pages/purchase-payment-add/purchase-payment-add.component';
import { PurchasePaymentListComponent } from './pages/purchase-payment-list/purchase-payment-list.component';
import { PurchasePaymentViewComponent } from './pages/purchase-payment-view/purchase-payment-view.component';
import { PurchasePaymentRoutingModule } from './purchase-payment-routing.module';
import { PurchasePaymentComponent } from './purchase-payment.component';

@NgModule({
  declarations: [
    PurchasePaymentAddComponent,
    PurchasePaymentViewComponent,
    PurchasePaymentListComponent,
    PurchasePaymentComponent,
    PurchasePaymentDetailAddDialogComponent,
    PurchasePaymentDetailEditDialogComponent,
  ],
  imports: [
    CommonModule,
    PurchasePaymentRoutingModule,
    SharedModule,
    FcDatepickerModule,
    FcInputNumberModule,
    FcInputTextModule,
    FcPaginationModule,
  ],
})
export class PurchasePaymentModule {}
