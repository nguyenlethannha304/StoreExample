import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  isPasswordValid,
  isTwoPasswordSame,
} from '../shared/validate/validate';
import { environment as e } from 'src/environments/environment';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(public location: Location, private http: HttpClient) {}

  ngOnInit(): void {}
  // FORM SECTION
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
      let body = {
        old_password: this.oldPass.value,
        new_password1: this.newPass.value,
        new_password2: this.confirmPass.value,
      };
      this.http
        .post(`${e.api}/users/change_password`, body, {
          headers: { Authorization: '' },
          observe: 'events',
        })
        .subscribe({
          next: (events) => {
            console.log('Ok', events);
          },
          error: (error) => {
            console.log('Error', error);
          },
          complete: () => {
            console.log('Done');
          },
        });
    }
  }
}
