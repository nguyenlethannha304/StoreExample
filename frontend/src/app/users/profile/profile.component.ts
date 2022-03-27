import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  Profile,
  Province,
  ProvinceWithCities,
} from '../shared/interface/profile';
import { EmptyResponse } from 'src/app/shared/interface/empty-response';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { renderErrorsFromBackend } from 'src/app/shared/common-function';
import { Router } from '@angular/router';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private navSer: NavigateService,
    public location: Location,
    private http: HttpClient,
    private render: Renderer2,
    private messageSer: MessageService
  ) {}

  ngOnInit(): void {
    this.getProvinesCitiesData();
  }
  ngAfterViewInit(): void {
    this.renderProvinces();
    this.getProfile();
  }
  ngOnDestroy(): void {}
  // FORM SECTION
  @ViewChild('formErrorContainer') formErrorContainer: ElementRef;
  @ViewChild('provinceContainer') provinceContainer: ElementRef;
  @ViewChild('cityContainer') cityContainer: ElementRef;
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
    let body = {
      phone: this.phone.value,
      street: this.street.value,
      city: this.city.value,
      province: this.province.value,
    };
    this.http
      .post<EmptyResponse>(`${e.api}/users/profile/`, body, {
        headers: { Authorization: '' },
      })
      .subscribe({
        next: () => {
          this.messageSer.showSuccessAutoDestroyMessage(
            'Thông tin cá nhân thay đổi thành công'
          );
        },
        error: (errors) => {
          renderErrorsFromBackend(errors, this.formErrorContainer, this.render);
        },
        complete: () => {
          this.navSer.navigateTo('users:profile');
        },
      });
  }
  // GET PROFILE
  getProfile() {
    this.http
      .get<Profile>(`${e.api}/users/profile/`, {
        headers: { Authorization: '' },
      })
      .subscribe((profile) => {
        this.phone.setValue(profile['phone']);
        this.street.setValue(profile['street']);
        this.province.setValue(profile['province']['id']);
        this.city.setValue(profile['city']['id']);
      });
  }
  // GET PROVINCES AND CITIES => SAVE to this.provincesCitiesData$
  provincesCitiesData: ProvinceWithCities[];
  getProvinesCitiesData() {
    this.http
      .get<ProvinceWithCities[]>(`${e.api}/users/get_provinces_cities/`)
      .subscribe((data) => {
        this.provincesCitiesData = data;
      });
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
    let current_province_id: number = this.province.value;
    // Remove all options of City Select before Render new Cities
    let childrenElements = this.cityContainer.nativeElement.children;
    for (let child of childrenElements) {
      this.render.removeChild(this.cityContainer.nativeElement, child);
    }
    // Render new Cities corresponding to new Province
    Array.from(this.provincesCitiesData).forEach(
      (province: ProvinceWithCities) => {
        if (province.id == current_province_id) {
          Array.from(province.city_set).forEach((city: City) => {
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
    let provinceSelect = this.provinceContainer.nativeElement;
    let optionElement = this.render.createElement('option');
    let optionText = this.render.createText(provinceData['name']);
    this.render.setProperty(optionElement, 'value', provinceData['id']);
    this.render.appendChild(optionElement, optionText);
    this.render.appendChild(provinceSelect, optionElement);
    if (setValueToForm) {
      this.province.setValue(provinceData['id']);
    }
  }
  renderCity(cityData: City, setValueToForm: boolean = false) {
    let citySelect = this.cityContainer.nativeElement;
    let optionElement = this.render.createElement('option');
    let optionText = this.render.createText(cityData['name']);
    this.render.setProperty(optionElement, 'value', cityData['id']);
    this.render.appendChild(optionElement, optionText);
    this.render.appendChild(citySelect, optionElement);
    if (setValueToForm) {
      this.city.setValue(cityData['id']);
    }
  }
}
