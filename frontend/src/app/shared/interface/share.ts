export interface FactoryInterface<T> {
  init: (value: T, ...args: unknown[]) => T;
  isValid: (value: T, ...args: unknown[]) => boolean;
}
export interface AdapterInterface<T, U> {
  convert(value: T): U;
}
export type UUID = string;
export const UUID: FactoryInterface<UUID> = {
  init(value: UUID) {
    if (this.isValid(value)) return value;
    throw new Error(`Giá trị không hợp lệ`);
  },
  isValid(value: UUID) {
    let uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return value.match(uuidPattern) ? true : false;
  },
};
export type PositiveInteger = number;
export const PositiveInteger: FactoryInterface<PositiveInteger> = {
  init(value: PositiveInteger) {
    return this.isValid(value) ? value : null;
  },
  isValid(value: PositiveInteger) {
    if (Number.isInteger(value) && value >= 0) {
      return true;
    }
    throw new Error(`${value} phải nguyên dương và lớn hơn hoặc bằng không`);
  },
};
export interface CreateKeyValueFromFactory<T> {
  keyName: string;
  value: T;
  factory: FactoryInterface<T>;
  arg: unknown;
}
export const createKeyValueForObject = (
  keyName: string,
  value: any,
  factory: FactoryInterface<any> = null,
  arg: unknown = null
): CreateKeyValueFromFactory<any> => {
  return { keyName, value, factory, arg };
};
export const createObject = (
  ...fields: CreateKeyValueFromFactory<any>[]
): any => {
  let object = {};
  for (let field of fields) {
    if (field.factory != null) {
      object = Object.assign(object, {
        [field.keyName]: field.factory.init(field.value, field.arg),
      });
    } else {
      object = Object.assign(object, { [field.keyName]: field.value });
    }
  }
  return object;
};
