import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';
import { SharedModule } from '@shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerAddComponent } from './pages/customer-add/customer-add.component';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerViewComponent } from './pages/customer-view/customer-view.component';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerAddComponent,
    CustomerViewComponent,
    CustomerListComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    FcPaginationModule,
  ],
})
export class CustomerModule {}
