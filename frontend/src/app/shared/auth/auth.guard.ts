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
        if (accessToken != '') {
          // If accessToken existed
          return true;
        }
        return this.navigateToLoginPage(state);
      })
    );
  }
  navigateToLoginPage(state: RouterStateSnapshot) {
    // Navigate to login page with queryparam next=current-page-url
    return this.router.createUrlTree(
      [`${this.navSer.getUrlFromName('users:login')}`],
      { queryParams: { next: `${state.url}` } }
    );
  }
}
