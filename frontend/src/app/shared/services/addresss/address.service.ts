import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  City,
  Province,
  ProvinceWithCities,
} from 'src/app/users/shared/interface/users';
import { environment as e } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient, private render: Renderer2) {}
  private _provinceCityData: ProvinceWithCities[] = [];
  get provinceCityData() {
    return this._provinceCityData;
  }
  set provinceCityData(data: ProvinceWithCities[]) {
    this._provinceCityData = data;
  }
  private getProvinceCityData$() {
    this.http
      .get<ProvinceWithCities[]>(`${e.api}/users/get_provinces_cities/`)
      .subscribe((data) => (this.provinceCityData = data));
  }
  private _citiData: City[] = [];
  get cityData(): City[] {
    return this._citiData;
  }
  set cityData(value: City[]) {
    this._citiData = value;
  }
  private getCityData(id: Province['id']): void {
    let cities: City[] = this.provinceCityData.find(
      (province) => province.id == id
    ).cities;
    this.cityData = cities;
  }
  renderProvince(province: ProvinceWithCities, targetElement: ElementRef) {
    let provinceSelect = targetElement.nativeElement;
    let optionElement = this.render.createElement('option');
    let optionText = this.render.createText(province['name']);
    this.render.setProperty(optionElement, 'value', province['id']);
    this.render.appendChild(optionElement, optionText);
    this.render.appendChild(provinceSelect, optionElement);
  }
  // renderCities(provinceInput:FormControl, targetElement:ElementRef) {
  //   let current_province_id: number = provinceInput.value
  //   if (current_province_id == null) {
  //     return;
  //   }
  //   // Remove all options of City Select before Render new Cities
  //   let childrenElements =
  //     targetElement.nativeElement.querySelectorAll('option');
  //   Array.from(childrenElements).forEach((child) =>
  //     this.render.removeChild(targetElement.nativeElement, child)
  //   );
  //   // Render new Cities corresponding to new Province
  //   Array.from(this.provinceCityData).forEach(
  //     (province: ProvinceWithCities) => {
  //       if (province.id == current_province_id) {
  //         Array.from(province.cities).forEach((city: City) => {
  //           this.renderCity(city);
  //         });
  //       }
  //     }
  //   );
  // }
  renderCity(cityData: City, targetElement: ElementRef) {
    let citySelect = targetElement.nativeElement;
    let optionElement = this.render.createElement('option');
    let optionText = this.render.createText(cityData['name']);
    this.render.setProperty(optionElement, 'value', cityData['id']);
    this.render.appendChild(optionElement, optionText);
    this.render.appendChild(citySelect, optionElement);
  }
}
