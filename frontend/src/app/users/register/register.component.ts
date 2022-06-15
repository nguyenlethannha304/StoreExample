import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  isEmailValid,
  isPasswordValid,
  isTwoPasswordSame,
} from '../shared/validate/validate';
import { environment as e } from 'src/environments/environment';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import { renderErrorsFromBackend } from 'src/app/shared/common-function';
import { Email, Password } from '../shared/interface/users';
import {
  createKeyValueForObject,
  createObject,
} from 'src/app/shared/interface/share';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    public location: Location,
    private http: HttpClient,
    private messageSer: MessageService,
    private navSer: NavigateService,
    private render: Renderer2,
    private authTokenService: AuthTokenService
  ) {}

  ngOnInit(): void {
    this.authTokenService.logout();
  }
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
  registerForm = new FormGroup(
    {
      email: new FormControl('', [isEmailValid()]),
      pass: new FormControl('', [isPasswordValid()]),
      confirmPass: new FormControl('', [isPasswordValid()]),
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
  onSubmit() {
    try {
      var body = createObject(
        createKeyValueForObject('email', this.email.value, Email),
        createKeyValueForObject('password1', this.pass.value, Password),
        createKeyValueForObject('password2', this.confirmPass.value, Password)
      ) as { email: Email; password1: Password; password2: Password };
    } catch (e) {
      if (e instanceof Error) {
        this.messageSer.createErrorMessage(e.message);
        return;
      }
    }
    this.http
      .post(`${e.api}/users/register/`, body, { observe: 'response' })
      .subscribe({
        next: (response) => {
          this.messageSer.createSucessMessage(
            `Bạn đã đăng ký thành công. Email đăng ký của bạn là ${body.email}`,
            5
          );
        },
        error: (errors) => {
          renderErrorsFromBackend(errors, this.formErrorContainer, this.render);
        },
        complete: () => {
          this.navSer.navigateTo('home');
        },
      });
  }
}
