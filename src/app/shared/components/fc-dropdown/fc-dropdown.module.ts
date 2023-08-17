import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FcDropdownComponent } from './fc-dropdown.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FcDropdownComponent],
  imports: [CommonModule, SharedModule],
  exports: [FcDropdownComponent],
})
export class FcDropdownModule {}
