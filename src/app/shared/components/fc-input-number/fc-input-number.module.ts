import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FcCalculatorModule } from '../fc-calculator/fc-calculator.module';
import { FcInputNumberComponent } from './fc-input-number.component';

@NgModule({
  declarations: [FcInputNumberComponent],
  imports: [CommonModule, FcCalculatorModule, SharedModule],
  exports: [FcInputNumberComponent],
})
export class FcInputNumberModule {}
