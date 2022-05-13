import { Injectable } from '@angular/core';
import { CartItem } from './cart';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
import { Observable, of, map } from 'rxjs';
import { MessageService } from '../shared/services/message/message.service';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { ProductDetail } from '../products/shared/interface/products';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemList: CartItem[] = [];
  count: number;
  state: CartState;
  constructor(
    public authService: AuthTokenService,
    public messageService: MessageService,
    public http: HttpClient
  ) {
    this.updateCart();
  }
  updateCart() {
    this.setCartState();
    this.countCartItems();
  }
  getCartItems(): void {
    let observable$ = this.state.getCartItem$();
    observable$.subscribe((cartItemList) => (this.cartItemList = cartItemList));
  }
  addCartItems(id: string, quantity: number) {
    let observable$ = this.state.addCartItem(id, quantity);
    observable$.subscribe((success) => {
      if (success) {
        this.messageService.createSucessMessage('Đã thêm vào giỏ hàng');
        this.countCartItems();
      } else {
        this.messageService.createErrorMessage(
          'Hệ thống gặp sự cố vui lòng thử lại'
        );
      }
    });
  }
  deleteCartItems(id: string) {
    let observable$ = this.state.deleteCartItem(id);
    observable$.subscribe((success) => {
      if (success) {
        this.cartItemList = this.cartItemList.filter(
          (cartItem) => cartItem.id != id
        );
        this.countCartItems();
      } else {
        this.messageService.createErrorMessage(
          'Hệ thống gặp sự cố vui lòng thử lại'
        );
      }
    });
  }
  changeCartItemQuantity(id: string, quantity: number) {
    let observable$ = this.state.changeCartItemQuantity(id, quantity);
    observable$.subscribe((success) => {
      if (!success) {
        this.messageService.createErrorMessage(
          'Hệ thống gặp sự cố vui lòng thử lại'
        );
      }
    });
  }
  private setCartState() {
    this.authService.accessToken$.subscribe((accessToken) => {
      if (accessToken != '') {
        this.state = new CartOnlineState(this);
      } else {
        this.state = new CartOfflineState(this);
      }
    });
  }
  private countCartItems(): void {
    let observable$ = this.state.countCartItem$();
    observable$.subscribe((count) => (this.count = count));
  }
}
// --------------------
// CartState (Offline and Online)
// --------------------
interface CartState {
  countCartItem$(): Observable<number>;
  getCartItem$(): Observable<CartItem[]>;
  addCartItem(id: string, quantity: number): Observable<boolean>;
  deleteCartItem(id: string): Observable<boolean>;
  changeCartItemQuantity(id: string, quantity: number): Observable<boolean>;
}
// CART OFFLINE
class CartOfflineState implements CartState {
  // Used for anonymous users
  constructor(private cartService: CartService) {}
  countCartItem$(): Observable<number> {
    if (this.getItemCartFromLocalStorage() == null) {
      return of(0);
    }
    return of(this.getItemCartFromLocalStorage().length);
  }
  getCartItem$(): Observable<CartItem[]> {
    let cartItem = this.getItemCartFromLocalStorage();
    return of(cartItem);
  }
  addCartItem(id: string, quantity: number): Observable<boolean> {
    return this.saveItemCartToLocalStorage(id, quantity);
  }
  deleteCartItem(id: string): Observable<boolean> {
    // Delete in LocalStorage
    let cartItemList = this.getItemCartFromLocalStorage();
    let newCartItemList = cartItemList.filter((itemCart) => itemCart.id != id);
    window.localStorage.setItem('itemCart', JSON.stringify(newCartItemList));
    return of(true);
  }
  changeCartItemQuantity(id: string, quantity: number): Observable<boolean> {
    return this.saveItemCartToLocalStorage(id, quantity);
  }
  private getItemCartFromLocalStorage(): CartItem[] {
    let cartItemString = window.localStorage.getItem('itemCart');
    return JSON.parse(cartItemString) as CartItem[];
  }
  private saveItemCartToLocalStorage(
    id: string,
    quantity: number
  ): Observable<boolean> {
    let cartItemList = this.getItemCartFromLocalStorage();
    let newCartItemList = this.saveItemCartToList(id, quantity, cartItemList);
    window.localStorage.setItem('itemCart', JSON.stringify(newCartItemList));
    return of(true);
  }
  private saveItemCartToList(
    id: string,
    quantity: number,
    cartItemList: CartItem[]
  ): CartItem[] {
    let newCartItemList = Object.assign({}, cartItemList);
    // Update item cart (item exists in the cart)
    for (let item of cartItemList) {
      if (item['id'] == id) {
        item['quantity'] = quantity;
        return newCartItemList;
      }
    }
    // Add new item to cart (item not exist in the cart)
    newCartItemList.push({ id: id, quantity: quantity, product: null });
    return newCartItemList;
  }
}
// CART ONLINE
class CartOnlineState implements CartState {
  // Used for logged-in users
  http: HttpClient;
  authService: AuthTokenService;
  constructor(private cartService: CartService) {
    this.http = this.cartService.http;
    this.authService = this.cartService.authService;
  }
  countCartItem$(): Observable<number> {
    return this.http.get<number>('/api/carts/count/', {
      headers: { Authorization: '' },
    });
  }
  getCartItem$(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>('/api/carts/', {
      headers: { Authorization: '' },
    });
  }
  addCartItem(id: string, quantity: number): Observable<boolean> {
    return this.http
      .post(
        '/api/cart/',
        { product_id: id, quantity: quantity },
        { headers: { Authorization: '' }, observe: 'response' }
      )
      .pipe(
        map((response) => {
          if (response.status == HttpStatusCode.Ok) {
            return true;
          }
          return false;
        })
      );
  }
  deleteCartItem(id: string): Observable<boolean> {
    return this.http
      .delete(`/api/carts/item-delete/${id}`, {
        headers: { Authorization: '' },
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status == HttpStatusCode.Ok) {
            return true;
          }
          return false;
        })
      );
  }
  changeCartItemQuantity(id: string, quantity: number): Observable<boolean> {
    return this.http
      .put(
        '/api/carts/',
        { id: id, quantity: quantity },
        { headers: { Authorization: '' }, observe: 'response' }
      )
      .pipe(
        map((response) => {
          if (response.status == HttpStatusCode.Ok) {
            return true;
          }
          return false;
        })
      );
  }
}
class BackEndOrderApdapter {
  // Convert frontEnd order data to backEnd compatible
  constructor(
    private cartItemList: CartItem[],
    private useUserAddress: boolean = false,
    private addressForm: FormGroup | null
  ) {}
  convertFrontEndToBackEnd() {
    let rv: BackEndOrder = { products: null };
    rv['products'] = this.cartItemList;
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
  getOrderItem(): Partial<ProductDetail>[] {
    let orderItemList: Partial<ProductDetail>[] = [];
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
