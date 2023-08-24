// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'Sistem Informasi Kelurahan',
  // appVersion: require('../../package.json').version + '-dev',
  API_URL: 'http://192.168.1.7:8000/api/v1',
  domain: 'http://192.168.1.7:8000/storage',
  locale_string: 'IDR',
  default_currency_code: 'id',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
