import { isPhoneNumber, isEmail, isPassword } from '../validate/validate';
import { OrderTrackingInformation } from 'src/app/orders/orders';
// USER INFORMATION
export type Phone = string;
export type Email = string;
export type Username = Email | Phone;
export type Password = string;
// ADDRESS INFORMATION
export type Address = {
  street: string;
  city: City;
  province: Province;
};
export type AddressForSubmit = {
  street: string;
  city: City['id'];
  province: Province['id'];
};
export interface ProvinceWithCities extends Province {
  cities: City[];
}
export type Province = {
  id: number;
  name: string;
};
export type City = {
  id: number;
  name: string;
  province: number;
};
// PROFILE INFORMATION
export type Profile = {
  phone: Phone;
  street: string;
  province: Province;
  city: City;
};
export type UserOrder = {
  phone: Phone;
  orders: Pick<
    OrderTrackingInformation,
    'id' | 'total_price' | 'created_time'
  >[];
};
