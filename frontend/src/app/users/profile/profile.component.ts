import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { isPhoneNumberValid } from '../shared/validate/validate';
import { environment as e } from 'src/environments/environment';
import {
  City,
  Province,
  ProvinceWithCities,
  Profile,
  Phone,
  AddressForSubmit,
} from '../shared/interface/users';
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
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private navSer: NavigateService,
    private router: Router,
    public location: Location,
    private http: HttpClient,
    private render: Renderer2,
    private messageSer: MessageService
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    zip(this.getProvinesCitiesData(), this.getProfile()).subscribe((_) => {
      this.renderProvinces();
      this.renderProfile();
    });
  }
  ngOnDestroy(): void {}
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
  @ViewChild('provinceSelect') provinceSelect: ElementRef;
  @ViewChild('citySelect') citySelect: ElementRef;
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
    console.log(body);
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
  updateCityInformation() {
    this.profile.province = this.province.value;
    this.renderCities();
    this.city.setValue(0);
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
  renderProfile() {
    this.phone.setValue(this.profile.phone);
    this.street.setValue(this.profile.street);
    this.province.setValue(this.profile.province['id']);
    this.renderCities(); // re-render city values
    this.city.setValue(this.profile.city['id']);
  }
  // GET PROVINCES AND CITIES => SAVE to this.provincesCitiesData$
  provincesCitiesData: ProvinceWithCities[];
  getProvinesCitiesData() {
    return this.http
      .get<ProvinceWithCities[]>(`${e.api}/users/get_provinces_cities/`)
      .pipe(tap((data) => (this.provincesCitiesData = data)));
    // .subscribe((data) => {
    //   this.provincesCitiesData = data;
    // });
  }
  renderProvinces() {
    Array.from(this.provincesCitiesData).forEach(
      (province: ProvinceWithCities) => {
        this.renderProvince(province);
      }
    );
  }
  // RENDER new CITIES IF PROVINCE is CHANGED
  renderCities() {
    let current_province_id: number = this.province.value
      ? this.province.value
      : this.profile.province;
    if (current_province_id == null) {
      return;
    }
    // Remove all options of City Select before Render new Cities
    let childrenElements =
      this.citySelect.nativeElement.querySelectorAll('option');
    Array.from(childrenElements).forEach((child) =>
      this.render.removeChild(this.citySelect.nativeElement, child)
    );
    // Render new Cities corresponding to new Province
    Array.from(this.provincesCitiesData).forEach(
      (province: ProvinceWithCities) => {
        if (province.id == current_province_id) {
          Array.from(province.cities).forEach((city: City) => {
            this.renderCity(city);
          });
        }
      }
    );
  }
  // SUPPORTED FUNCTIONS
  renderProvince(
    provinceData: Province | ProvinceWithCities,
    setValueToForm: boolean = false
  ) {
    let provinceSelect = this.provinceSelect.nativeElement;
    let optionElement = this.render.createElement('option');
    let optionText = this.render.createText(provinceData['name']);
    this.render.setProperty(optionElement, 'value', provinceData['id']);
    this.render.appendChild(optionElement, optionText);
    this.render.appendChild(provinceSelect, optionElement);
  }
  renderCity(cityData: City, setValueToForm: boolean = false) {
    let citySelect = this.citySelect.nativeElement;
    let optionElement = this.render.createElement('option');
    let optionText = this.render.createText(cityData['name']);
    this.render.setProperty(optionElement, 'value', cityData['id']);
    this.render.appendChild(optionElement, optionText);
    this.render.appendChild(citySelect, optionElement);
  }
}
