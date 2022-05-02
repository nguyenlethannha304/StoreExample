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
export interface Province {
  id: number;
  name: string;
}
export interface City {
  id: number;
  name: string;
  province: number;
}
