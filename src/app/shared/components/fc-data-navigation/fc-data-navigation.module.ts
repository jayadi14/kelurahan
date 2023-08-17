import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FcDataNavigationComponent } from './fc-data-navigation.component';

@NgModule({
  declarations: [FcDataNavigationComponent],
  imports: [CommonModule, SharedModule],
  exports: [FcDataNavigationComponent],
})
export class FcDataNavigationModule {}
