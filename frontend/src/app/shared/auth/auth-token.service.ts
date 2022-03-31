import { Injectable } from '@angular/core';
import { catchError, Observable, of, map, tap, Observer } from 'rxjs';
import { NavigateService } from '../services/navigate/navigate.service';
import { environment as e } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenPair } from '../interface/token';
import { Router } from '@angular/router';
import { AccessToken } from '../interface/token';
import { FormErrors } from '../interface/errors';
@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private _accessToken: string = '';
  private _accessTokenSetTime: number = 0;
  private _refreshToken: string = '';
  private _refreshTokenSetTime: number = 0;
  private _refreshTokenName = 'refresh-token';
  private _refreshTokenSetTimeName = 'refresh-token-set-time';
  private redirect: string;
  constructor(
    private navSer: NavigateService,
    private http: HttpClient,
    private router: Router
  ) {
    [this._refreshToken, this._refreshTokenSetTime] =
      this.getRefreshTokenFromLocalStorage();
  }
  login = (
    username: string,
    password: string,
    errorShownFunc: (body: FormErrors) => void,
    redirect: string
  ) => {
    // submit username and password to server to get 2 tokens
    this.http
      .post<TokenPair>(`${e.api}/token/token_pair/`, {
        username,
        password,
      })
      .subscribe({
        next: (body) => {
          this.accessToken = body.access;
          this.refreshToken = body.refresh;
          this.redirect = redirect;
        },
        error: (errors) => {
          errorShownFunc(errors);
        },
        complete: () => {
          this.router.navigateByUrl(this.redirect);
        },
      });
  };
  clear = () => {
    // Clear token and navigate to homepage
    this.accessToken = '';
    this.refreshToken = '';
    window.localStorage.setItem(this._refreshTokenName, '');
  };
  get accessToken(): string {
    return this._accessToken;
  }
  set accessToken(value: string) {
    this._accessToken = value;
    if (value != '') {
      this._accessTokenSetTime = new Date().getTime();
    }
  }
  get accessToken$(): Observable<string> {
    if (this.accessToken != '' && !this.isTokenExpire('access')) {
      // Get token from cache if not expired
      return of(this.accessToken);
    } else if (this.refreshToken !== '' && !this.isTokenExpire('refresh')) {
      // Send refreshToken to server to get accessToken
      return this.http
        .post<AccessToken>(`${e.api}/token/refresh_token/`, {
          refresh: this.refreshToken,
        })
        .pipe(
          map((body) => body.access),
          tap((accessToken) => {
            // Save token after getting from server
            this.accessToken = accessToken;
          }),
          catchError((err, caught) => of(''))
        );
    } else {
      return of('');
    }
  }
  get refreshToken(): string {
    return this._refreshToken;
  }
  set refreshToken(value: string) {
    this._refreshToken = value;
    if (value != '') {
      // Save to local storage
      this._refreshTokenSetTime = new Date().getTime();
      window.localStorage.setItem(this._refreshTokenName, this._refreshToken);
      window.localStorage.setItem(
        this._refreshTokenSetTimeName,
        this._refreshTokenSetTime.toString()
      );
    }
  }
  isTokenExpire = (type: 'access' | 'refresh'): boolean => {
    let duration = 0;
    let tokenSetTime = 0;
    if (type == 'access') {
      duration = e.accessTokenExpireIn;
      tokenSetTime = this._accessTokenSetTime;
    } else if (type == 'refresh') {
      duration = e.refreshTokenExpireIn;
      tokenSetTime = this._refreshTokenSetTime;
    }
    return tokenSetTime + duration + 10000 <= new Date().getTime(); // Add 10000 or 10 seconds
  };
  getRefreshTokenFromLocalStorage = (): [string, number] => {
    let refreshToken = window.localStorage.getItem(this._refreshTokenName);
    // Check if refreshToken saved in localStorage
    if (refreshToken != null) {
      this._refreshTokenSetTime = parseInt(
        window.localStorage.getItem(this._refreshTokenSetTimeName)
      );
      // Check if refreshToken expired
      if (!this.isTokenExpire('refresh')) {
        // Return refreshToken if not expired
        return [refreshToken, this._refreshTokenSetTime];
      }
    }
    // Return empty
    return ['', 0];
  };
}
