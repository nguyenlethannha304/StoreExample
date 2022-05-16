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
  isPasswordValid,
  isTwoPasswordSame,
} from '../shared/validate/validate';
import { environment as e } from 'src/environments/environment';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import { renderErrorsFromBackend } from 'src/app/shared/common-function';
import { EmptyResponse } from 'src/app/shared/interface/empty-response';
import { Password } from '../shared/interface/users';
import {
  createObject,
  CreateFieldData,
  createParameterForObject,
} from 'src/app/shared/interface/share';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    public location: Location,
    private http: HttpClient,
    private messageSer: MessageService,
    private render: Renderer2,
    private navSer: NavigateService
  ) {}

  ngOnInit(): void {}
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
  changePassForm: FormGroup = new FormGroup(
    {
      oldPass: new FormControl('', isPasswordValid()),
      newPass: new FormControl('', isPasswordValid()),
      confirmPass: new FormControl('', isPasswordValid()),
    },
    isTwoPasswordSame('newPass', 'confirmPass')
  );
  get oldPass(): AbstractControl {
    return this.changePassForm.get('oldPass');
  }
  get newPass(): AbstractControl {
    return this.changePassForm.get('newPass');
  }
  get confirmPass(): AbstractControl {
    return this.changePassForm.get('confirmPass');
  }
  onSubmit() {
    if (this.changePassForm.valid) {
      try {
        var body = createObject(
          createParameterForObject(
            'old_password',
            this.oldPass.value,
            Password
          ),
          createParameterForObject(
            'new_password1',
            this.newPass.value,
            Password
          ),
          createParameterForObject(
            'new_password2',
            this.confirmPass.value,
            Password
          )
        ) as {
          old_password: Password;
          new_password1: Password;
          new_password2: Password;
        };
      } catch (e) {
        if (e instanceof Error) {
          this.messageSer.createErrorMessage(e.message);
          return;
        }
      }
      this.http
        .post<EmptyResponse>(`${e.api}/users/change_password`, body, {
          headers: { Authorization: '' },
          observe: 'body',
        })
        .subscribe({
          next: () => {
            this.messageSer.createSucessMessage('Mật khẩu thay đổi thành công');
          },
          error: (errors) => {
            renderErrorsFromBackend(
              errors,
              this.formErrorContainer,
              this.render
            );
          },
          complete: () => {
            this.navSer.navigateTo('home');
          },
        });
    }
  }
}
