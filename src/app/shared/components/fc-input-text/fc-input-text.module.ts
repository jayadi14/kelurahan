import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FcInputTextComponent } from './fc-input-text.component';

@NgModule({
  declarations: [FcInputTextComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [FcInputTextComponent],
})
export class FcInputTextModule {}
