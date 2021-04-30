// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// DEV
export const environment = {
  production: false,
  FIREBASE: {
    apiKey: 'AIzaSyBebx1WLevPWD-1vaQLetIrNo7la6clTr4',
    authDomain: 'https://dev.nhadaiphat.net',
    databaseURL: 'https://nhadaiphat-dev.firebaseapp.com',
    projectId: 'nhadaiphat-dev',
    storageBucket: 'nhadaiphat-dev.appspot.com',
  },
  API_DOMAIN: 'https://api.dev.nhadaiphat.net',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
