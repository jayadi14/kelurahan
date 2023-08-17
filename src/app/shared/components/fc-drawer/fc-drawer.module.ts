import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FcDrawerComponent } from './fc-drawer.component';

@NgModule({
  declarations: [FcDrawerComponent],
  imports: [CommonModule, SharedModule],
  exports: [FcDrawerComponent],
})
export class FcDrawerModule {}
