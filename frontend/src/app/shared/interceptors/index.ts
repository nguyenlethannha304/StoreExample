import { AuthInterceptor } from './auth.interceptor';

export const httpInterceptorProviders = [
  { provide: AuthInterceptor, useClass: AuthInterceptor, multi: true },
];
