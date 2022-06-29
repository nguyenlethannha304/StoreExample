import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartService } from '../carts/cart.service';
import { MessageService } from '../shared/services/message/message.service';
import {
  OrderItem,
  Order,
  ShippingInformation,
  OrderTrackingInformation,
} from './orders';
import { environment as e } from 'src/environments/environment';
import { AuthTokenService } from '../shared/auth/auth-token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from '../carts/cart';
const PLACE_ORDER_URL = `${e.api}/orders/place-order/`;
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  public cartItemList: CartItem[] = [];
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
  ) {
    this.cartService.cartItemList$.subscribe(
      (cartItemList) => (this.cartItemList = cartItemList)
    );
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
    if (cartItem.quantity > cartItem.product.quantity) {
      return false;
    }
    return true;
  }
  submitOrder(shippingInfor: ShippingInformation) {
    let isLogin = this.authService.isLogin() ? 'yes' : 'no';
    let body = this.getBodyForSubmitOrder(shippingInfor);
    this.http
      .post<OrderTrackingInformation>(PLACE_ORDER_URL, body, {
        headers: { Authorization: isLogin },
        observe: 'response',
      })
      .subscribe((response) => {
        if (response.status == HttpStatusCode.Created) {
          this.cartService.clear();
          this.router.navigate(['orders', 'tra-cuu-don-hang'], {
            queryParams: {
              id: response.body['id'],
              phone: response.body['phone_number'],
            },
          });
        } else if (response.status == HttpStatusCode.BadRequest) {
          this.router.navigate(['carts']);
          this.messageService.createErrorMessage('Lỗi vui lòng thử lại');
        }
      });
  }
  private getBodyForSubmitOrder(shippingInfor: ShippingInformation): Order {
    let products = this.getOrderItems();
    let productInfor = {
      products,
      item_price: this.calcTotalItemPrice(true),
      shipping_fee: this.calcShippingFee(true),
      total_price: this.calcTotalPrice(true),
    };
    return Object.assign(productInfor, shippingInfor);
  }
  private getOrderItems() {
    let result: OrderItem[] = [];
    for (let cartItem of this.cartItemList) {
      result.push(OrderItem.convert(cartItem));
    }
    return result;
  }
  clearOrderItem(): void {
    this.orderItems = [];
  }
  calcTotalItemPrice(cache: boolean = false): Order['item_price'] {
    if (cache == true && this.totalItemPrice != 0) {
      return this.totalItemPrice;
    }
    let result: Order['item_price'] = 0;
    for (let cartItem of this.cartItemList) {
      result += cartItem.quantity * cartItem.product.price;
    }
    this.totalItemPrice = result;
    return result;
  }
  calcShippingFee(cache: boolean = false): Order['shipping_fee'] {
    if (cache == true && this.shippingPrice != 0) {
      return this.shippingPrice;
    }
    this.shippingPrice = this.getShippingFee();
    return this.shippingPrice;
  }
  private getShippingFee(): Order['shipping_fee'] {
    return 0;
  }
  calcTotalPrice(use_cache: boolean = true): Order['total_price'] {
    return this.calcTotalItemPrice(use_cache) + this.calcShippingFee(use_cache);
  }
}
