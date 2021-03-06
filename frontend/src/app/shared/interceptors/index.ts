import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoadingInterceptor } from './loading.interceptor';
import { NetworkError5xxInterceptor } from './network-error-5xx.interceptor';
// import { FakeResponseInterceptor } from './fake-response.interceptor';

export const httpInterceptorProviders = [
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: FakeResponseInterceptor,
  //   multi: true,
  // }, //Used for testing request
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, //Attached accessToken to Request
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NetworkError5xxInterceptor,
    multi: true,
  }, //Dealing with Response.status = 5xx
  {provide:HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi:true} // Show loading symbol on screen
];
