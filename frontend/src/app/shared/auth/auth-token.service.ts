import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment as e } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AccessToken,
  TokenPair,
  RefreshToken,
  UNIXTime,
} from '../interface/token';
import { FormErrors } from '../interface/errors';
const TOKEN_PAIR_URL = `${e.api}/token/token_pair/`; // Post username and password to get token pair
const REFRESH_TOKEN_URL = `${e.api}/token/refresh_token/`; // Post refresh token to get access token
@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  // TOKEN
  private _accessToken: AccessToken = '';
  private _accessTokenSetTime: UNIXTime = 0;
  private _refreshToken: RefreshToken = '';
  private _refreshTokenSetTime: UNIXTime = 0;
  // Name to retrieve from LocalStorage
  private _refreshTokenName = 'refresh-token';
  private _refreshTokenSetTimeName = 'refresh-token-set-time';

  private redirect: string;
  constructor(private http: HttpClient, private router: Router) {
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
      .post<TokenPair>(TOKEN_PAIR_URL, {
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
  logout = () => {
    // Clear token and navigate to homepage
    this.accessToken = '';
    this.refreshToken = '';
    window.localStorage.setItem(this._refreshTokenName, '');
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
      .post<AccessToken>(REFRESH_TOKEN_URL, {
        refresh: this.refreshToken,
      })
      .pipe(
        tap((accessToken) => {
          // Save token after getting from server
          this.accessToken = accessToken;
        }),
        catchError((err, caught) => of(''))
      );
  }
}
