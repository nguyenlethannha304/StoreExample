export const isPhoneNumber = (phone: string): boolean => {
  const PHONE_PATTERN: RegExp = /(+84|0)\d{9}/;
  return PHONE_PATTERN.test(phone);
};
export const isEmail = (email: string): boolean => {
  if (!email.includes('@')) {
    return false;
  }
  const LOCAL_PATTERN: RegExp = getLocalPattern();
  const DOMAIN_PATTERN: RegExp = getDomainPattern();
  let [localPart, domain]: Array<string> = email.rsplit('@');
  if (localPart.length == 0 || localPart.length > 64) {
    //   localPart can't be more than 64 chars
    return false;
  }
  if (domain.length == 0 || domain.length > 255) {
    //   domain can't be more than 255 chars
    return false;
  }
  if (!LOCAL_PATTERN.test(localPart) || !DOMAIN_PATTERN.test(domain)) {
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
