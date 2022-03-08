import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  isEmailValid,
  isPasswordValid,
  isTwoPasswordSame,
} from '../shared/validate/validate';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit(): void {}
  // FORM SECTION
  registerForm = new FormGroup(
    {
      email: new FormControl('', isEmailValid()),
      pass: new FormControl('', isPasswordValid()),
      confirmPass: new FormControl('', isPasswordValid()),
    },
    isTwoPasswordSame('pass', 'confirmPass')
  );
  get email(): AbstractControl {
    return this.registerForm.get('email');
  }
  get pass(): AbstractControl {
    return this.registerForm.get('pass');
  }
  get confirmPass(): AbstractControl {
    return this.registerForm.get('confirmPass');
  }
  onSubmit() {}
}
