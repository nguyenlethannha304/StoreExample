import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
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
import { EmptyResponse } from 'src/app/shared/interface/empty-response';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
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
    private render: Renderer2
  ) {}

  ngOnInit(): void {}
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
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
  onSubmit() {
    let email = this.email.value;
    let password1 = this.pass.value;
    let password2 = this.confirmPass.value;
    let body = { email, password1, password2 };
    this.http
      .post(`${e.api}/users/register`, body, { observe: 'response' })
      .subscribe({
        next: (response: HttpEvent<EmptyResponse>) => {
          this.messageSer.showSuccessAutoDestroyMessage(
            `Your registration is successful. Your registered email is ${email}`
          );
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorForm(error.error);
        },
        complete: () => {
          this.navSer.navigateTo('home');
        },
      });
  }
  showErrorForm = (error: Object) => {
    // Remove all old errors
    Array.from(this.formErrorContainer.nativeElement.children).forEach(
      (child) => {
        this.render.removeChild(this.formErrorContainer.nativeElement, child);
      }
    );
    // Render new errors
    for (let value of Object.values(error)) {
      let elementError = this.render.createElement('p');
      let elementText = this.render.createText(value);
      this.render.appendChild(elementError, elementText);
      this.render.appendChild(
        this.formErrorContainer.nativeElement,
        elementError
      );
    }
  };
}
