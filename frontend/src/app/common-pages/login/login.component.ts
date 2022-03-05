import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigateService } from 'src/app/shared/navigate/navigate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: { class: 'form-custom' },
})
export class LoginComponent implements OnInit {
  constructor(public navSer: NavigateService) {}

  ngOnInit(): void {}
}
