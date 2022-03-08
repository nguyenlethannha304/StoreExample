import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { isPhoneNumberValid } from '../shared/validate/validate';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit(): void {}
  // FORM SECTION
  profileForm = new FormGroup({
    phone: new FormControl('', isPhoneNumberValid()),
    address: new FormControl(''),
    province: new FormControl(''),
    city: new FormControl(''),
  });
  get phone(): AbstractControl {
    return this.profileForm.get('phone');
  }
  onSubmit() {}
}
