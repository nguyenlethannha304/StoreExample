import { City, Province } from './users';
export interface Profile {
  phone: string;
  street: string;
  province: Province['id'];
  city: City['id'];
}
export interface ProvinceWithCities {
  id: number;
  name: string;
  cities: City[];
}
