
export interface AdapterInterface<T, U> {
  convert(value: T): U;
}
export type UUID = string;

export type PositiveInteger = number;
