import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, map } from 'rxjs';
import { environment as e } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AccessToken,
  TokenPair,
  RefreshToken,
  UNIXTime,
  ObjectWrapAccessToken,
} from '../interface/token';
import { AuthPublisher, AuthSubscriber } from './auth';
const TOKEN_PAIR_URL = `${e.api}/token/token_pair/`; // Post username and password to get token pair
const REFRESH_TOKEN_URL = `${e.api}/token/refresh_token/`; // Post refresh token to get access token
@Injectable({
  providedIn: 'root',
})
export class AuthTokenService implements AuthPublisher {
  // TOKEN
  private _accessToken: AccessToken = '';
  private _accessTokenSetTime: UNIXTime = 0;
  private _refreshToken: RefreshToken = '';
  private _refreshTokenSetTime: UNIXTime = 0;
  // Name to retrieve from LocalStorage
  private _accessTokenName = 'access-token';
  private _accessTokenSetTimeName = 'access-token-set-time';
  private _refreshTokenName = 'refresh-token';
  private _refreshTokenSetTimeName = 'refresh-token-set-time';

  private redirectURL: string;
  // OBSERVERS
  public subscribers: AuthSubscriber[] = [];
  logInNotify(): void {
    for (let sub of this.subscribers) {
      sub.logInUpdate();
    }
  }
  logOutNotify(): void {
    for (let sub of this.subscribers) {
      sub.logOutUpdate();
    }
  }
  constructor(private http: HttpClient, private router: Router) {
    [this._refreshToken, this._refreshTokenSetTime] =
      this.getRefreshTokenFromLocalStorage();
    [this._accessToken, this._accessTokenSetTime] =
      this.getAccessTokenFromLocalStorage();
  }
  login = (
    username: string,
    password: string,
    errorShownFunc: (body: HttpErrorResponse) => void,
    redirect: string
  ) => {
    // submit username and password to server to get 2 tokens
    this.http
      .post<TokenPair>(TOKEN_PAIR_URL, {
        username,
        password,
      })
      .subscribe({
        next: (body) => {
          this.accessToken = body.access;
          this.refreshToken = body.refresh;
          this.logInNotify();
          this.redirectURL = redirect;
          this.router.navigateByUrl(this.redirectURL);
        },
        error: (errors) => {
          errorShownFunc(errors);
        },
      });
  };
  isLogin() {
    if (this._accessToken && !this.isTokenExpire('access')) {
      return true;
    }
    return false;
  }
  logout = () => {
    // Clear token and navigate to homepage
    this.accessToken = '';
    this.refreshToken = '';
    window.localStorage.setItem(this._accessTokenName, '');
    window.localStorage.setItem(this._refreshTokenName, '');
    this.logOutNotify();
  };
  get accessToken$(): Observable<AccessToken> {
    if (this.accessToken != '' && !this.isTokenExpire('access')) {
      // Get token from cache if not expired
      return of(this.accessToken);
    }
    if (this.refreshToken !== '' && !this.isTokenExpire('refresh')) {
      return this.sendRefreshToServerToGetAccessToken();
    }
    return of('');
  }
  private get accessToken(): AccessToken {
    return this._accessToken;
  }
  private set accessToken(value: AccessToken) {
    this._accessToken = value;
    if (value != '') {
      this._accessTokenSetTime = new Date().getTime();
      window.localStorage.setItem(this._accessTokenName, this._accessToken);
      window.localStorage.setItem(
        this._accessTokenSetTimeName,
        this._accessTokenSetTime.toString()
      );
    }
  }
  private get refreshToken(): RefreshToken {
    return this._refreshToken;
  }
  private set refreshToken(value: RefreshToken) {
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
  private isTokenExpire = (type: 'access' | 'refresh'): boolean => {
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
  private getAccessTokenFromLocalStorage = (): [AccessToken, UNIXTime] => {
    let accessToken = window.localStorage.getItem(this._accessTokenName);
    if (accessToken != null) {
      this._accessTokenSetTime = parseInt(
        window.localStorage.getItem(this._accessTokenSetTimeName)
      );
    }
    if (!this.isTokenExpire('access')) {
      return [accessToken, this._accessTokenSetTime];
    }
    return ['', 0];
  };
  private getRefreshTokenFromLocalStorage = (): [RefreshToken, UNIXTime] => {
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
  private sendRefreshToServerToGetAccessToken() {
    return this.http
      .post<ObjectWrapAccessToken>(REFRESH_TOKEN_URL, {
        refresh: this.refreshToken,
      })
      .pipe(
        map((objectWrapAccessToken) => objectWrapAccessToken.access),
        tap((accessToken) => {
          this.accessToken = accessToken;
        }),
        catchError((err, caught) => of(''))
      );
  }
}
