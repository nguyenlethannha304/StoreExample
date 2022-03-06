import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigateService } from 'src/app/shared/navigate/navigate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  host: { class: 'form-custom' },
})
export class RegisterComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit(): void {}
}
