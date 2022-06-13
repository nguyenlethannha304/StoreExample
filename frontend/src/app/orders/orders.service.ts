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
import { CartItem } from '../carts/cart';
const PLACE_ORDER_URL = `${e.api}/orders/place-order/`;
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public orderItems: OrderItem[] = [];
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
  public getCartItemForDisplay(): CartItem[] {
    let result: CartItem[] = [];
    for (let cartItem of this.cartService.cartItemList) {
      if (this.validateCartItem(cartItem)) {
        result.push(cartItem);
      }
    }
    return result;
  }
  public setOrderItems(): void {
    this.clearOrderItem();
    this.cartService.cartItemList$.subscribe((cartItemList) => {
      for (let cartItem of cartItemList) {
        if (this.validateCartItem(cartItem)) {
          this.orderItems.push(OrderItem.convert(cartItem));
        }
      }
    });
  }
  private validateCartItem(cartItem: CartItem) {
    return true;
  }
  submitOrder(body: Order) {
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
  clearOrderItem(): void {
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
