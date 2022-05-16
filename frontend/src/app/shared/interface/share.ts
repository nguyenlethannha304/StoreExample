export interface FactoryInterface<T> {
  create(value: T, ...args: unknown[]): T;
  isValid(value: T, ...args: unknown[]): boolean;
}
export const hasNull = (
  object: Object,
  errorMessage: Function
): Object | true => {
  for (let value of Object.values(object)) {
    if (value == null) {
      errorMessage(`Giá trị ${value} không hợp lệ`);
      return true;
    }
  }
  return object;
};
export interface CreateFieldData<T> {
  keyName: string;
  value: T;
  factory: FactoryInterface<T>;
}
export const createParameterForObject = (
  keyName: string,
  value: any,
  factory: FactoryInterface<any> = null
): CreateFieldData<any> => {
  return { keyName, value, factory };
};
export const createObject = (...fields: CreateFieldData<any>[]): any => {
  // create an object with {
  // [key:field.keyName]: field.factory? field.factory.create(value): field.value
  // }
  let object = {};
  for (let field of fields) {
    if (field.factory != null) {
      object = Object.assign(object, {
        [field.keyName]: field.factory.create(field.value),
      });
    } else {
      object = Object.assign(object, { [field.keyName]: field.value });
    }
  }
  return object;
};
