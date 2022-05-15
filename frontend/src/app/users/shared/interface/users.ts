export type Address = {
  street: string;
  city: City['id'];
  province: Province['id'];
};
export interface Province {
  id: number;
  name: string;
}
export interface City {
  id: number;
  name: string;
  province: number;
}
export class AddressObject implements Address {
  constructor(
    private street: string,
    private city: City['id'],
    private province: Province['id']
  ) {}
  toJSON() {}
}
