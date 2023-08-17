import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FcBooleanInputComponent } from './fc-boolean-input.component';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  declarations: [FcBooleanInputComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, LottieModule],
  exports: [FcBooleanInputComponent],
})
export class FcBooleanInputModule {}
