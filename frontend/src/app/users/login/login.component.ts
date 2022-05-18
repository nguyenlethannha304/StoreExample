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
import { renderErrorsFromBackend } from 'src/app/shared/common-function';
import { FormErrors } from 'src/app/shared/interface/errors';
import {
  createKeyValueForObject,
  createObject,
} from 'src/app/shared/interface/share';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import { Password, Username } from '../shared/interface/users';
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
    private messageSer: MessageService,
    private route: ActivatedRoute,
    private render: Renderer2
  ) {}
  ngOnInit(): void {
    this.redirectAfterLogin = this.route.snapshot.queryParams['next'];
  }
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
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
  renderLoginFormErrors = (errors: FormErrors) => {
    renderErrorsFromBackend(errors, this.formErrorContainer, this.render);
  };
  onSubmit() {
    if (this.loginForm.valid) {
      // let body = getBody(
      //   { value: username, factory: Username },
      //   { value: password, factory: Password }
      // );
      try {
        var body = createObject(
          createKeyValueForObject('username', this.username.value, Username),
          createKeyValueForObject('password', this.password.value, Password)
        ) as { username: Username; password: Password };
      } catch (e) {
        if (e instanceof Error) {
          this.messageSer.createErrorMessage(e.message);
          return;
        }
      }
      console.log(body);
      this.authTokenSer.login(
        body.username,
        body.password,
        this.renderLoginFormErrors,
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
