import { Component, OnInit } from '@angular/core';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private authTokenSer: AuthTokenService,
    private navSer: NavigateService
  ) {}

  ngOnInit(): void {
    // Clear tokens and navigate back to home page
    this.authTokenSer.logout();
    this.navSer.navigateTo('home');
  }
}
