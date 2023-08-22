import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './register/register.component';
import { FcDatepickerModule } from '@shared/components/fc-datepicker/fc-datepicker.module';
import { FcInputTextModule } from '@shared/components/fc-input-text/fc-input-text.module';
import { FcInputNumberModule } from '@shared/components/fc-input-number/fc-input-number.module';
import { FcSelectOptionModule } from '@shared/components/fc-select-option/fc-select-option.module';
import { RegisterSelectRtDialogComponent } from './register/components/register-select-rt-dialog/register-select-rt-dialog.component';
import { FcPaginationModule } from '@shared/components/fc-pagination/fc-pagination.module';

@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent, RegisterSelectRtDialogComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PasswordModule,
    SharedModule,
    FcDatepickerModule,
    FcInputTextModule,
    FcInputNumberModule,
    FcSelectOptionModule,
    FcPaginationModule
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AuthModule {}
