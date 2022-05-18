import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartService } from '../carts/cart.service';
import {
  createObject,
  createKeyValueForObject,
} from '../shared/interface/share';
import { MessageService } from '../shared/services/message/message.service';
import { Address, Email, Phone } from '../users/shared/interface/users';
import { OrderItem, Order } from './orders';
import { environment as e } from 'src/environments/environment';
import { AuthTokenService } from '../shared/auth/auth-token.service';
import { ActivatedRoute, Router } from '@angular/router';
const PLACE_ORDER_URL = `${e.api}/orders/place-order/`;
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  orderItems: OrderItem[] = [];
  private totalItemPrice: Order['item_price'];
  private shippingPrice: Order['shipping_fee'];
  constructor(
    private cartService: CartService,
    private messageService: MessageService,
    private http: HttpClient,
    private authService: AuthTokenService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  setUp() {
    this.setOrderItems();
  }
  getOrderItems(): OrderItem[] {
    return this.orderItems;
  }
  private setOrderItems(): void {
    let result: OrderItem[] = [];
    for (let cartItem of this.cartService.cartItemList) {
      if (this.cartService.validateCartItem(cartItem)) {
        result.push(OrderItem.convert(cartItem));
      }
    }
    this.orderItems = result;
  }
  submitOrder(
    email: Email,
    phone_number: Phone,
    address: Address,
    use_profile_contact: boolean
  ) {
    let body = this.createBodyData(
      email,
      phone_number,
      address,
      use_profile_contact
    );
    let isLogin = this.authService.isLogin(true) ? 'yes' : null;
    this.http
      .post(PLACE_ORDER_URL, body, {
        headers: { Authorization: isLogin },
        observe: 'response',
      })
      .subscribe((response) => {
        if (response.status == HttpStatusCode.Created) {
          this.router.navigate(['../order-complete'], {
            relativeTo: this.route,
            state: { body: response.body },
          });
        } else if (response.status == HttpStatusCode.BadRequest) {
          this.router.navigate(['carts']);
          this.messageService.createErrorMessage('Lỗi vui lòng thử lại');
        }
      });
  }
  private createBodyData(
    email: Email,
    phone_number: Phone,
    address: Address,
    use_profile_contact: boolean
  ) {
    try {
      let body = createObject(
        createKeyValueForObject('products', this.orderItems),
        createKeyValueForObject('item_price', this.calcTotalItemPrice()),
        createKeyValueForObject('shipping_fee', this.calcShippingFee()),
        createKeyValueForObject('total_price', this.calcTotalPrice()),
        createKeyValueForObject('email', email, Email),
        createKeyValueForObject('phone_number', phone_number, Phone),
        createKeyValueForObject('address', address),
        createKeyValueForObject('use_profile_contact', use_profile_contact)
      ) as Order;
    } catch (e) {
      if (e instanceof Error) {
        this.messageService.createErrorMessage(e.message);
      }
    }
  }
  clear(): void {
    this.orderItems = [];
  }
  calcTotalItemPrice(cache: boolean = false): Order['item_price'] {
    if (cache == true && this.totalItemPrice != 0) {
      return this.totalItemPrice;
    }
    let result: Order['item_price'] = 0;
    for (let item of this.orderItems) {
      result += item.price;
    }
    this.totalItemPrice = result;
    return result;
  }
  calcShippingFee(cache: boolean = false): Order['shipping_fee'] {
    if (cache == true && this.shippingPrice != 0) {
      return this.totalItemPrice;
    }
    let result = 0;
    this.shippingPrice = result;
    return result;
  }
  calcTotalPrice(use_cache: boolean = true): Order['total_price'] {
    return this.calcTotalItemPrice(use_cache) + this.calcShippingFee(use_cache);
  }
}
