import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
const rsplit = function (
  text: string,
  separator: string,
  maxSplit: number = 0
): Array<string> {
  let textArray = text.split(separator);
  let arrayLength = textArray.length;
  if (arrayLength == 1 || maxSplit >= arrayLength) {
    return textArray;
  }
  if (maxSplit) {
    let result = [
      textArray.slice(0, arrayLength - maxSplit + 1).join(separator),
    ];
    for (let i = 1; i <= maxSplit - 1; i++) {
      result = result.concat(textArray[arrayLength - maxSplit + i]);
    }
    return result;
  } else {
    //   Array['startString to lastSeparator', 'lastSeparator to endString']
    return [textArray.slice(0, arrayLength - 1).join('@')].concat(
      textArray[arrayLength - 1]
    );
  }
};

export const isTwoPasswordSame = (
  firstPassName: string,
  secondPassName: string
) => {
  return (control: AbstractControl): ValidationErrors | null => {
    let firstPassControl = control.get(firstPassName);
    let secondPassControl = control.get(secondPassName);
    if (firstPassControl.value !== secondPassControl.value) {
      return { password: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau' };
    }
    return null;
  };
};
export const required = ():ValidatorFn => {
  return (control:AbstractControl):ValidationErrors | null => {
    if(control.value !== ""){
      return null
    }
    return {required: "Vui lòng điền thông tin vào mục này"}
  }
}
export const isEmailValid = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isEmail(control.value)) {
      return null;
    }
    return { Email: 'Địa chỉ Email không hợp lệ' };
  };
};
export const isPhoneNumberValid = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isPhoneNumber(control.value)) {
      return null;
    }
    return { phoneNumber: 'Số điện thoại không hợp lệ' };
  };
};
export const isPasswordValid = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value.length >= 8) {
      return null;
    }
    return { password: 'Mật khẩu phải ít nhất 8 ký tự' };
  };
};
export const isPassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }
  return true;
};
export const isPhoneNumber = (phone: string): boolean => {
  const PHONE_PATTERN: RegExp = /^(\+84|0)\d{9}$/;
  return PHONE_PATTERN.test(phone);
};
export const isEmail = (email: string): boolean => {
  if (!email.includes('@')) {
    return false;
  }
  const LOCAL_PATTERN: RegExp = getLocalPattern();
  const DOMAIN_PATTERN: RegExp = getDomainPattern();
  let [localPart, domainPart]: Array<string> = rsplit(email, '@');
  if (!emailAddressLengthValid(localPart, domainPart)) {
    return false;
  }
  if (!LOCAL_PATTERN.test(localPart) || !DOMAIN_PATTERN.test(domainPart)) {
    return false;
  }
  return true;
};
const emailAddressLengthValid = (
  localPart: string,
  domainPart: string
): boolean => {
  if (localPart.length == 0 || localPart.length > 64) {
    return false;
  }
  if (domainPart.length == 0 || domainPart.length > 255) {
    return false;
  }
  return true;
};
const getLocalPattern = (): RegExp => {
  return /^[A-Z0-9!#$%&'*+-/=?^_`{|}~]+(\.[A-Z0-9!#$%&'*+-/=?^_`{|}~]+)*$|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*"$/i;
};
const getDomainPattern = (): RegExp => {
  return /\[([A-F0-9:.]+)\]$|(([A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?\.)+)([A-Z0-9-]{2,63}(?<!-))$/i;
};
