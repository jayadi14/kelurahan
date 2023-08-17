import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import localeId from '@angular/common/locales/id';
import { AppModule } from './app/app.module';
import { environment } from '@env';
import { enableProdMode } from '@angular/core';
import { registerLocaleData } from '@angular/common';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
  // register locale data
registerLocaleData(localeId, environment.default_currency_code);
