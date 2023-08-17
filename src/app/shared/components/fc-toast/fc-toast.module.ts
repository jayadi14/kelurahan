import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieModule } from 'ngx-lottie';
import { ToastItemComponent } from './components/toast-item/toast-item.component';
import { FcToastComponent } from './fc-toast.component';
export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}
@NgModule({
  declarations: [FcToastComponent, ToastItemComponent],
  imports: [CommonModule, FontAwesomeModule, FormsModule, LottieModule],
  exports: [FcToastComponent],
})
export class FcToastModule {}
