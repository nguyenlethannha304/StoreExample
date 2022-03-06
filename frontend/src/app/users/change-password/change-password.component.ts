import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigateService } from 'src/app/shared/navigate/navigate.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  host: { class: 'form-custom' },
})
export class ChangePasswordComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit(): void {}
}
