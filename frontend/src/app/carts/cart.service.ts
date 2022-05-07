import { Injectable } from '@angular/core';
import { CartItem } from './cart';
import { AuthTokenService } from 'src/app/shared/auth/auth-token.service';
import { Observable, of } from 'rxjs';
import { MessageService } from '../shared/services/message/message.service';
import { HttpClient } from '@angular/common/http';
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
    this.setState();
  }
  setState() {
    this.authService.accessToken$.subscribe((accessToken) => {
      if (accessToken != '') {
        // this.state = new CartOnlineState(this);
      } else {
        this.state = new CartOfflineState(this);
      }
    });
  }
  getCartItems(): void {
    let observable$ = this.state.getCartItem$();
    observable$.subscribe();
  }
  addItemCart(id: string, quantity: number) {
    this.state.addCartItem(id, quantity);
  }
  deleteItemCart(id: string) {
    let observable$ = this.state.deleteCartItem(id);
    observable$.subscribe((result) => {
      if (result) {
        this.cartItemList = this.cartItemList.filter(
          (cartItem) => cartItem.id != id
        );
      }
    });
  }
  changeItemCartQuantity(id: string, quantity: number) {
    this.state.changeCartItemQuantity(id, quantity);
  }
  countItemCart(): void {
    let observable$ = this.state.countCartItem$();
    observable$.subscribe((count) => (this.count = count));
  }
}
interface CartState {
  countCartItem$(): Observable<number>;
  getCartItem$(): Observable<CartItem[]>;
  addCartItem(id: string, quantity: number): void;
  deleteCartItem(id: string): Observable<boolean>;
  changeCartItemQuantity(id: string, quantity: number): void;
}
// --------------------
// Implement CartState (Offline and Online)
// --------------------
class CartOfflineState implements CartState {
  // Used for anonymous users
  constructor(private cartService: CartService) {}
  countCartItem$(): Observable<number> {
    return of(this.cartService.cartItemList.length);
  }
  getCartItem$(): Observable<CartItem[]> {
    let cartItem = this.getItemCartFromLocalStorage();
    return of(cartItem);
  }
  addCartItem(id: string, quantity: number): void {
    this.saveItemCartToLocalStorage(id, quantity);
  }
  deleteCartItem(id: string): Observable<boolean> {
    // Delete in LocalStorage
    let cartItemList = this.getItemCartFromLocalStorage();
    let newCartItemList = cartItemList.filter((itemCart) => itemCart.id != id);
    window.localStorage.setItem('itemCart', JSON.stringify(newCartItemList));
    return of(true);
  }
  changeCartItemQuantity(id: string, quantity: number): void {
    this.saveItemCartToLocalStorage(id, quantity);
  }
  private getItemCartFromLocalStorage(): CartItem[] {
    let cartItemString = window.localStorage.getItem('itemCart');
    return JSON.parse(cartItemString) as CartItem[];
  }
  private saveItemCartToLocalStorage(id: string, quantity: number): void {
    let cartItemList = this.getItemCartFromLocalStorage();
    this.saveItemCartToList(id, quantity, cartItemList);
    window.localStorage.setItem('itemCart', JSON.stringify(cartItemList));
  }
  private saveItemCartToList(
    id: string,
    quantity: number,
    cartItemList: CartItem[]
  ) {
    // Update item cart (item exists in the cart)
    for (let item of cartItemList) {
      if (item['id'] == id) {
        item['quantity'] += quantity;
        return;
      }
    }
    // Add new item to cart (item not exist in the cart)
    cartItemList.push({ id: id, quantity: quantity, product: null });
  }
}
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
  addCartItem(id: string, quantity: number): void {
    this.http.post(
      '/api/cart/',
      { product_id: id, quantity: quantity },
      { headers: { Authorization: '' } }
    );
  }
  deleteCartItem(id: string): Observable<boolean> {
    this.http.delete(`/api/carts/item-delete/${id}`, {
      headers: { Authorization: '' },
    });
  }
  changeCartItemQuantity(id: string, quantity: number): void {
    this.http.put(
      '/api/carts/',
      { id: id, quantity: quantity },
      { headers: { Authorization: '' } }
    );
  }
}
