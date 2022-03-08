import { Component, HostBinding, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { NavigateService } from 'src/app/shared/navigate/navigate.service';
import {
  isPhoneNumberValid,
  isEmailValid,
  isPasswordValid,
} from '../shared/validate/validate';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(public navSer: NavigateService) {}
  ngOnInit(): void {}
  // FORM SECTION
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', isUsernameValid()),
    password: new FormControl('', isPasswordValid()),
  });
  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
  onSubmit() {}
}

// Username validate
const isUsernameValid = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let emailIsValid = isEmailValid()(control);
    let phoneNumberIsValid = isPhoneNumberValid()(control);
    if (emailIsValid === null || phoneNumberIsValid === null) {
      return null;
    }
    return { username: 'Tên đăng nhập không hợp lệ' };
  };
};
