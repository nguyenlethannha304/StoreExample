import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { isPhoneNumberValid } from '../shared/validate/validate';
import { environment as e } from 'src/environments/environment';
import { City, Profile, Province } from '../shared/interface/profile';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  constructor(
    public location: Location,
    private http: HttpClient,
    private render: Renderer2
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  // FORM SECTION
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
  onSubmit() {}
  // GET PROFILE
  getProfile() {
    this.http
      .get<Profile>(`${e.api}/users/profile/`, {
        headers: { Authorization: '' },
      })
      .subscribe((profile) => {
        this.phone.setValue(profile['phone']);
        this.street.setValue(profile['street']);
        this.renderProvince(profile['province'], true);
        this.renderCity(profile['city'], true);
      });
  }
  // GET PROVINCE
  getProvinceCityData() {}
  // GET CITY IF PROVINCE IS PROVIDED
  // SUPPORTED FUNCTIONS
  renderProvince(provinceData: Province, setValueToForm: boolean = false) {
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
