import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
import { MessageService } from 'src/app/shared/services/message/message.service';
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
    private route: ActivatedRoute,
    private render: Renderer2
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
    // Remove all old error before rendering the new one
    Array.from(this.formErrorContainer.nativeElement.children).forEach(
      (child) => {
        this.render.removeChild(this.formErrorContainer.nativeElement, child);
      }
    );
    // Render new error
    let errorElement = this.render.createElement('p');
    let errorText = this.render.createText(body.detail);
    this.render.appendChild(errorElement, errorText);
    this.render.appendChild(
      this.formErrorContainer.nativeElement,
      errorElement
    );
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
