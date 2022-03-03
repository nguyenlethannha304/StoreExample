import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}
  accessToken: string | null = null;
  accessTokenSetTime: number = 0;
  refreshToken: string | null = null;
  refreshTokenSetTime: number = 0;
}
