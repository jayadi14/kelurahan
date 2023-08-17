import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FcDialogModule } from '../fc-dialog/fc-dialog.module';
import { FcCalculatorComponent } from './fc-calculator.component';

@NgModule({
  declarations: [FcCalculatorComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    FcDialogModule,
    ClipboardModule,
  ],
  exports: [FcCalculatorComponent],
})
export class FcCalculatorModule {}
