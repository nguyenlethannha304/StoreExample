import { Injectable } from '@angular/core';
import { CartItem } from './cart';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
import { Observable, of, map, AsyncSubject, Subject, debounceTime } from 'rxjs';
import { MessageService } from '../shared/services/message/message.service';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { environment as e } from 'src/environments/environment';
const COUNT_URL = `${e.api}/carts/count/`;
const AUTH_CART_URL = `${e.api}/carts/`;
const DELETE_AUTH_CART_ITEM_URL = `${e.api}/carts/item-delete/`;
const RELATED_PRODUCT_URL = `${e.api}/carts/cart-product-information/`;
@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemList$ = new Subject<CartItem[]>();
  cartCount$ = new Subject<number>();
  state: CartState;
  constructor(
    public authService: AuthTokenService,
    public messageService: MessageService,
    public http: HttpClient
  ) {
    this.updateCart();
  }
  async updateCart() {
    let result = await this.setCartState();
    result.subscribe((_) => {
      this.countCartItems();
    });
  }
  countCartItems(): void {
    let observable$ = this.state.countCartItem$();
    observable$.subscribe((count) => {
      this.cartCount$.next(count);
    });
  }
  getCartItems() {
    return this.state
      .getCartItem$()
      .subscribe((cartItemList) => this.cartItemList$.next(cartItemList));
  }
  validateCartItem(cartItem: CartItem): boolean {
    return true;
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
  deleteCartItems(id: string): Observable<boolean> {
    return this.state.deleteCartItem(id);
  }
  changeCartItemQuantity(id: string, quantity: number) {
    let observable$ = this.state.changeCartItemQuantity(id, quantity);
    observable$.subscribe((boolean) => {
      if (!boolean) {
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
    return of(true);
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
    let cartItemList = this.getItemCartFromLocalStorage();
    if (cartItemList == null || cartItemList == []) {
      return of([]);
    }
    return this.getRelatedProductFromBackend(cartItemList);
  }

  private getRelatedProductFromBackend(
    cartItemList: Pick<CartItem, 'id' | 'quantity'>[]
  ): Observable<CartItem[]> {
    let idList: Array<string> = [];
    for (let cartItem of cartItemList) {
      idList.push(cartItem.id);
    }
    let idListString = idList.join(',');
    return this.cartService.http
      .get<CartItem['product'][]>(
        `${RELATED_PRODUCT_URL}?product-ids=${idListString}`
      )
      .pipe(
        map((relatedProducts) => {
          // Merge cartItemList and relatedProduct
          let result: CartItem[] = [];
          for (let cartItem of cartItemList) {
            for (let relatedProduct of relatedProducts) {
              if (cartItem.id == relatedProduct.id) {
                result.push({
                  id: cartItem.id,
                  quantity: cartItem.quantity,
                  product: relatedProduct,
                });
              }
            }
          }
          return result;
        })
      );
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
  private getItemCartFromLocalStorage(): Pick<CartItem, 'id' | 'quantity'>[] {
    let cartItemString = window.localStorage.getItem('itemCart');
    return JSON.parse(cartItemString);
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
    cartItemList: Pick<CartItem, 'id' | 'quantity'>[]
  ): Pick<CartItem, 'id' | 'quantity'>[] {
    let newCartItemList = Object.assign({}, cartItemList);
    // Update item cart (item exists in the cart)
    for (let item of cartItemList) {
      if (item['id'] == id) {
        item['quantity'] = quantity;
        return newCartItemList;
      }
    }
    // Add new item to cart (item not exist in the cart)
    newCartItemList.push({ id: id, quantity: quantity });
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
    return this.http.get<number>(COUNT_URL, {
      headers: { Authorization: 'yes' },
    });
  }
  getCartItem$(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(AUTH_CART_URL, {
      headers: { Authorization: 'yes' },
    });
  }
  addCartItem(id: string, quantity: number): Observable<boolean> {
    return this.http
      .post(
        AUTH_CART_URL,
        { product_id: id, quantity: quantity },
        { headers: { Authorization: 'yes' }, observe: 'response' }
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
      .delete(`${DELETE_AUTH_CART_ITEM_URL}${id}/`, {
        headers: { Authorization: 'yes' },
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
        AUTH_CART_URL,
        { cartitem_id: id, quantity: quantity },
        { headers: { Authorization: 'yes' }, observe: 'response' }
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
