import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FcConfirmComponent } from './fc-confirm.component';

@NgModule({
  declarations: [FcConfirmComponent],
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  exports: [FcConfirmComponent],
})
export class FcConfirmModule {}
