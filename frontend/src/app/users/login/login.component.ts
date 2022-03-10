import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
import { AuthError } from 'src/app/shared/interface/token';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
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
  constructor(
    public navSer: NavigateService,
    private authTokenSer: AuthTokenService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.redirectAfterLogin = this.route.snapshot.queryParams['next'];
  }
  // FORM SECTION
  @ViewChild('formError') formErrorContainer: ElementRef;
  redirectAfterLogin: string = '/'; //default redirect to homepage
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
  showErrorForm = (body: AuthError) => {
    this.formErrorContainer.nativeElement.innerHTML =
      '<p>Tên đăng nhập hoặc Mật khẩu không đúng</p>';
  };
  onSubmit() {
    if (this.loginForm.valid) {
      let username = this.username.value;
      let password = this.password.value;
      this.authTokenSer.login(
        username,
        password,
        this.showErrorForm,
        this.redirectAfterLogin
      );
    }
  }
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
