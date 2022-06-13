// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  django: 'http://127.0.0.1:8000',
  api: 'http://127.0.0.1:8000/api',
  accessTokenExpireIn: 5 * 60 * 1000, // 5 mins
  refreshTokenExpireIn: 1 * 24 * 60 * 60 * 1000, // 1 days
  //tokenTimeExpire will be set one hour lesser than backEnd unless use fullTime
  fullTimeExtend: 3600 * 1000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
