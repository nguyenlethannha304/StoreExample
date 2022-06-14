import { CartItem } from '../carts/cart';
import { Product } from '../products/shared/interface/products';
import { AdapterInterface, PositiveInteger } from '../shared/interface/share';
import { Address, Email, Phone } from '../users/shared/interface/users';

export type Order = {
  products: OrderItem[];
  item_price: number;
  shipping_fee: number;
  total_price: number;
  email: Email;
  phone_number: Phone;
  address: Address;
  use_profile_contact: boolean; //
};
export type ShippingInformation = Pick<
  Order,
  'email' | 'phone_number' | 'address' | 'use_profile_contact'
>;
export type OrderItem = {
  id: Product['id']; //Product id
  price: PositiveInteger;
  quantity: PositiveInteger;
};
interface OrderItemFunction {
  calcPrice: (cartItem: CartItem) => PositiveInteger;
}
export const OrderItem: AdapterInterface<CartItem, OrderItem> &
  OrderItemFunction = {
  convert(cartItem: CartItem): OrderItem {
    return {
      id: cartItem.product.id,
      quantity: cartItem.quantity,
      price: this['calcPrice'](cartItem),
    };
  },
  calcPrice: (cartItem: CartItem): PositiveInteger => {
    return cartItem.quantity * cartItem.product.price;
  },
};
