import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { NavigateService } from '../services/navigate/navigate.service';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Require user login
  constructor(
    private authTokenSer: AuthTokenService,
    private router: Router,
    private navSer: NavigateService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authTokenSer.accessToken$.pipe(
      map((accessToken) => {
        if (accessToken != '' && !this.authTokenSer.isTokenExpire('access')) {
          // If accessToken existed and not expired
          return true;
        } else {
          // Navigate to Login page with queryParam: ?next=state.url
          return this.router.createUrlTree(
            [`${this.navSer.getUrlFromName('users:login')}`],
            { queryParams: { next: `${state.url}` } }
          );
        }
      })
    );
  }
}
