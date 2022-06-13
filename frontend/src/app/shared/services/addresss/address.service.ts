import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';
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
  constructor(private http: HttpClient) {}
  private _provinceCityData: ProvinceWithCities[] = [];
  get provinceCityData() {
    return this._provinceCityData;
  }
  set provinceCityData(data: ProvinceWithCities[]) {
    this._provinceCityData = data;
  }
  public getProvinceCityData$() {
    return this.http
      .get<ProvinceWithCities[]>(`${e.api}/users/get_provinces_cities/`)
      .pipe(
        tap((data) => {
          this.provinceCityData = data;
        })
      );
  }
  private _citiData: City[] = [];
  get cityData(): City[] {
    return this._citiData;
  }
  set cityData(value: City[]) {
    this._citiData = value;
  }
  public getCityData(id: Province['id']): void {
    this.cityData = this.provinceCityData.find(
      (province) => province.id == id
    ).cities;
  }
}
