import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import {
  isPasswordValid,
  isTwoPasswordSame,
} from '../shared/validate/validate';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit(): void {}
  // FORM SECTION
  changePassForm: FormGroup = new FormGroup(
    {
      oldPass: new FormControl('', isPasswordValid()),
      newPass: new FormControl('', isPasswordValid()),
      confirmPass: new FormControl('', isPasswordValid()),
    },
    {
      validators: isTwoPasswordSame('newPass', 'confirmPass'),
      updateOn: 'blur',
    }
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
  onSubmit() {}
}
