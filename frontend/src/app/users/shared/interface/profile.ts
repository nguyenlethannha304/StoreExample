export interface Profile {
  phone: string;
  street: string;
  province: Province;
  city: City;
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
