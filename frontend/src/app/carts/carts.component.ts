import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { debounceTime, of, Subject } from 'rxjs';
import { MessageService } from '../shared/services/message/message.service';
import { CartItem } from './cart';
import { CartService } from './cart.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css'],
})
export class CartsComponent implements OnInit, OnChanges {
  constructor(
    public cartService: CartService,
    private messageService: MessageService
  ) {}
  cartItemList: CartItem[] = [];
  totalPrice: number = 0;
  changeQuantityCartItem$ = new Subject<Partial<CartItem>>();
  ngOnInit(): void {
    this.cartService.cartItemList$.subscribe((cartItemList) => {
      this.cartItemList = cartItemList;
      this.setTotalPrice();
    });
    this.cartService.getCartItems();
    this.changeQuantityCartItem$
      .pipe(debounceTime(1000))
      .subscribe((cartItem) => {
        this.cartService.changeCartItemQuantity(cartItem.id, cartItem.quantity);
        this.updateCartItemAfterChangeQuantity(cartItem.id, cartItem.quantity);
        this.setTotalPrice();
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setTotalPrice();
  }
  itemTrackBy(index: number, cartItem: CartItem) {
    return cartItem.id;
  }
  setTotalPrice() {
    this.totalPrice = 0;
    for (let item of this.cartItemList) {
      this.totalPrice += item.quantity * item.product.price;
    }
  }
  // App item cart output handlers
  changeQuantityCartItem({ id, quantity }: Partial<CartItem>) {
    this.changeQuantityCartItem$.next({ id, quantity });
  }
  updateCartItemAfterChangeQuantity(
    id: CartItem['id'],
    quantity: CartItem['quantity']
  ) {
    this.cartItemList = this.cartItemList.map((cartItem) => {
      if (cartItem.id == id) {
        let newCartItem = Object.assign({}, cartItem, { quantity });
        return newCartItem;
      }
      return cartItem;
    });
  }
  confirmDeleteCartItem(id: string) {
    let bindDeleteCartItem = this.deleteCartItem.bind(this, id);
    this.messageService.createConfirmMessage(
      'Bạn có muốn xoá sản phẩm này',
      bindDeleteCartItem
    );
  }
  deleteCartItem(id: string) {
    this.cartService.deleteCartItems(id).subscribe((boolean) => {
      if (boolean) {
        this.messageService.createSucessMessage('Đã xoá sản phẩm');
        this.cartService.countCartItems();
        this.updateCartItemAfterDeleteSuccessfully(id);
      } else {
        this.messageService.createErrorMessage(
          'Hệ thống gặp sự cố vui lòng thử lại'
        );
      }
    });
  }
  updateCartItemAfterDeleteSuccessfully(id: string) {
    this.cartItemList = this.cartItemList.filter(
      (cartItem) => cartItem.id != id
    );
  }
}
