import { HttpErrorResponse } from '@angular/common/http';
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
import { MessageService } from 'src/app/shared/services/message/message.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import {
  isPhoneNumberValid,
  isEmailValid,
  isPasswordValid,
  required,
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
    username: new FormControl('', [required(),isUsernameValid()]),
    password: new FormControl('', [required(),isPasswordValid()]),
  });
  get username():AbstractControl {
    return this.loginForm.get('username');
  }
  get password():AbstractControl {
    return this.loginForm.get('password');
  }
  renderLoginFormErrors = (errors: HttpErrorResponse) => {
    let objectError: FormErrors;
    if (errors.status == 401) {
      objectError = {
        detail: 'Sai mật khẩu hoặc tên đăng nhập.',
      };
    } else {
      objectError = errors.error;
    }
    renderErrorsFromBackend(objectError, this.formErrorContainer, this.render);
  };
  onSubmit() {
    if(this.loginForm.valid){
      let body = {username:this.username.value, password:this.password.value}
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
