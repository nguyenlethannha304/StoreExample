import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { isPhoneNumberValid } from '../shared/validate/validate';
import { environment as e } from 'src/environments/environment';
import { Profile, Phone, AddressForSubmit } from '../shared/interface/users';
import { EmptyResponse } from 'src/app/shared/interface/empty-response';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { renderErrorsFromBackend } from 'src/app/shared/common-function';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import {
  createKeyValueForObject,
  createObject,
} from 'src/app/shared/interface/share';
import { tap, zip } from 'rxjs';
import { FormErrors } from 'src/app/shared/interface/errors';
import { formErrorAdapter } from 'src/app/shared/utils/form-errors-adapter';
import { AddressService } from 'src/app/shared/services/addresss/address.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit {
  constructor(
    private navSer: NavigateService,
    public addressService: AddressService,
    public location: Location,
    private http: HttpClient,
    private render: Renderer2,
    private messageSer: MessageService
  ) {}

  ngAfterViewInit(): void {
    zip(
      this.getProfile(),
      this.addressService.getProvinceCityData$()
    ).subscribe((_) => {
      // this.renderProvinces();
      this.renderProfile();
    });
  }
  updateCityInformation() {
    this.addressService.getCityData(this.province.value);
    this.city.setValue('');
  }
  // GET PROFILE
  profile: Profile;
  getProfile() {
    return this.http
      .get<Profile>(`${e.api}/users/profile/`, {
        headers: { Authorization: 'yes' },
      })
      .pipe(
        tap((profile) => {
          this.profile = profile;
        })
      );
  }
  private renderProfile() {
    this.phone.setValue(this.profile.phone);
    this.street.setValue(this.profile.street);
    if (this.profile.province.id.toString() != '') {
      this.province.setValue(this.profile.province.id);
      this.updateCityInformation();
      if (this.profile.city.id.toString() != '') {
        this.city.setValue(this.profile.city.id);
      }
    }
  }
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
  profileForm = new FormGroup({
    phone: new FormControl('', isPhoneNumberValid()),
    street: new FormControl(''),
    province: new FormControl(''),
    city: new FormControl(''),
  });
  get phone(): AbstractControl {
    return this.profileForm.get('phone');
  }
  get street(): AbstractControl {
    return this.profileForm.get('street');
  }
  get province(): AbstractControl {
    return this.profileForm.get('province');
  }
  get city(): AbstractControl {
    return this.profileForm.get('city');
  }
  onSubmit() {
    try {
      var body = this.getBodyOnSubmit();
    } catch (e) {
      if (e instanceof Error) {
        this.messageSer.createErrorMessage(e.message);
        return;
      }
    }
    this.http
      .post<EmptyResponse>(
        `${e.api}/users/profile/`,
        {
          phone: body.phone,
          street: body.address.street,
          city: body.address.city,
          province: body.address.province,
        },
        {
          headers: { Authorization: 'yes' },
        }
      )
      .subscribe({
        next: () => {
          this.messageSer.createSucessMessage(
            'Thông tin cá nhân thay đổi thành công'
          );
        },
        error: (httpError: HttpErrorResponse) => {
          let errors: FormErrors = formErrorAdapter(httpError);
          renderErrorsFromBackend(errors, this.formErrorContainer, this.render);
        },
        complete: () => {
          this.navSer.navigateTo('home');
        },
      });
  }
  getBodyOnSubmit() {
    let body = createObject(
      createKeyValueForObject('phone', this.phone.value),
      createKeyValueForObject('address', {
        street: this.street.value,
        city: this.city.value,
        province: this.province.value,
      })
    ) as { phone: Phone; address: AddressForSubmit };
    return body;
  }
}
