import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FcConfirmModule } from '@shared/components/fc-confirm/fc-confirm.module';
import { FcToastModule } from '@shared/components/fc-toast/fc-toast.module';
import { LottieModule } from 'ngx-lottie';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    FontAwesomeModule,
    SharedModule,
    ToastModule,
    FcToastModule,
    LottieModule.forRoot({ player: playerFactory }),
    FcConfirmModule,
  ],
  providers: [provideClientHydration(), MessageService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
