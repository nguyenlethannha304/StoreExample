import { Component, OnInit } from '@angular/core';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  constructor(private authTokenSer: AuthTokenService) {}

  ngOnInit(): void {
    this.authTokenSer.clear();
  }
}
