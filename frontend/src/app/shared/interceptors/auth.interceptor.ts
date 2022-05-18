import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { AuthTokenService } from '../auth/auth-token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Attached Authorization header: (accessToken) to Request
  constructor(private authTokenSer: AuthTokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      request.headers.has('Authorization') &&
      request.headers.get('Authorization') == 'yes'
    ) {
      return from(authorizeRequest(request, next, this.authTokenSer));
    } else {
      return next.handle(request);
    }
  }
}
async function authorizeRequest(
  request: HttpRequest<unknown>,
  next: HttpHandler,
  authTokenSer: AuthTokenService
) {
  let authToken = '';
  await authTokenSer.accessToken$.subscribe((accessToken) => {
    authToken = `Bearer ${accessToken}`;
  });
  let cloneRequest = request.clone({
    headers: request.headers.set('Authorization', authToken),
  });
  return lastValueFrom(next.handle(cloneRequest));
}
