import { isPhoneNumber, isEmail, isPassword } from '../validate/validate';
import { FactoryInterface } from 'src/app/shared/interface/share';
// USER INFORMATION
export type Phone = string;
export const Phone: FactoryInterface<Phone> = {
  create(phone: Phone) {
    return this.isValid(phone) ? phone : null;
  },
  isValid(phone: Phone): boolean {
    if (isPhoneNumber(phone)) {
      return true;
    }
    throw new Error(`Số điện thoại: ${phone} không hợp lệ`);
  },
};
export type Email = string;
export const Email: FactoryInterface<Email> = {
  create(email: Email) {
    return this.isValid(email) ? email : null;
  },
  isValid(email: Email): boolean {
    if (isEmail(email)) {
      return true;
    }
    throw new Error(`Giá trị email: ${email} không hợp lệ`);
  },
};
export type Username = Email | Phone;
export const Username: FactoryInterface<Username> = {
  create(username: Username) {
    return this.isValid(username) ? username : null;
  },
  isValid(username: Username) {
    if (isEmail(username) || isPhoneNumber(username)) {
      return true;
    }
    throw new Error(`Tên đăng nhập ${username} không hợp lệ`);
  },
};
export type Password = string;
export const Password: FactoryInterface<Password> = {
  create(password: Password) {
    return this.isValid(password) ? password : null;
  },
  isValid(password: Password): boolean {
    if (isPassword(password)) {
      return true;
    }
    throw new Error(`Mật khẩu không hợp lệ`);
  },
};

// ADDRESS INFORMATION
export type Address = {
  street: string;
  city: City['id'];
  province: Province['id'];
};
export const Address: FactoryInterface<Address> = {
  create(address: Address, provinceWithCityList: ProvinceWithCities[]) {
    return this.isValid(address, provinceWithCityList) ? address : null;
  },
  isValid(
    address: Address,
    provinceWithCitiesList: ProvinceWithCities[]
  ): boolean {
    // Check if city belong to the province
    let addressProvince = provinceWithCitiesList.find(
      (province) => province.id == address.province
    );
    let addressCity = addressProvince.cities.find(
      (city) => city.id == address.city
    );
    if (addressCity) {
      return true;
    }
    throw new Error(`Lỗi mục tỉnh hoặc thành phố`);
  },
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
export type Profile = { phone: Phone } & Address;
