import { Injectable } from '@angular/core';
import { CartService } from '../carts/cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  orderItems: OrderItem[];
  constructor(private cartService: CartService) {}
}
class BackEndOrderApdapter {
  // Convert frontEnd order data to backEnd compatible
  constructor(
    private cartItemList: CartItem[],
    private useUserAddress: boolean = false,
    private addressForm: FormGroup | null
  ) {}
  convertFrontEndToBackEnd() {
    let rv: BackEndOrder;
    rv['products'] = this.getOrderItem();
    rv['item_price'] = this.getItemPrice();
    rv['shipping_fee'] = this.getShippingFee();
    rv['total_price'] = this.getTotalPrice(
      rv['item_price'],
      rv['shipping_fee']
    );
    rv['address'] = this.getAddress();
    rv['email'] = this.getEmailAddress();
    rv['phone_number'] = this.getPhone();
    rv['use_profile_contact'] = this.useUserAddress;
    return rv;
  }
  getOrderItem(): CartItem[] {
    let orderItemList: CartItem[] = [];
    for (let item of this.cartItemList) {
      let price = item;
      let orderItem = { id: item.id, quantity: item.quantity };
    }
    return orderItemList;
  }
  getItemPrice() {
    let item_price = 0;
    for (let item of this.cartItemList) {
      item_price += item.quantity * item.product.price;
    }
    return item_price;
  }
  getShippingFee() {
    return 0;
  }
  getTotalPrice(item_price: number, shipping_fee: number): number {
    return item_price + shipping_fee;
  }
  getAddress(): BackEndOrder['address'] {
    let address: BackEndOrder['address'] = {
      street: null,
      city: null,
      province: null,
    };
    address['street'] = this.addressForm.get('street').value;
    address['city'] = this.addressForm.get('city').value;
    address['province'] = this.addressForm.get('province').value;
    return address;
  }
  getEmailAddress() {
    return this.addressForm.get('email').value;
  }
  getPhone() {
    return this.addressForm.get('phone').value;
  }
}
interface BackEndOrder {
  products: CartItem;
  item_price: number;
  shipping_fee: number;
  total_price: number;
  address: { street: string; city: string; province: string };
  email: string;
  phone_number: string;
  use_profile_contact: boolean;
}
