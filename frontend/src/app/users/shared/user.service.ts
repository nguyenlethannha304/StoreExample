import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
import { Profile } from './interface/users';
import { of } from 'rxjs';
import { AuthSubscriber } from 'src/app/shared/auth/auth';
import { HttpClient } from '@angular/common/http';
import { environment as e } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService implements AuthSubscriber {
  userLogIn: boolean = false;
  constructor(private authService: AuthTokenService, private http: HttpClient) {
    this.setUserLogIn();
  }
  setUserLogIn() {
    this.authService.accessToken$.subscribe((accessToken) => {
      if (accessToken != '') {
        this.userLogIn = true;
      } else {
        this.userLogIn = false;
      }
    });
  }
  getProfileInformation$(): Observable<Profile> | Observable<null> {
    if (this.userLogIn) {
      return this.http.get<Profile>(`${e.api}/users/profile/`, {
        headers: { Authorization: 'yes' },
      });
    }
    return of(null);
  }
  getUserEmail(): Observable<string> | Observable<null> {
    if (this.userLogIn) {
      return this.http.get<string>(`${e.api}/users/get_email_address/`, {
        headers: { Authorization: 'yes' },
      });
    }
    return of(null);
  }
  public logInUpdate(): void {
    this.setUserLogIn();
  }
  public logOutUpdate(): void {
    this.setUserLogIn();
  }
}
