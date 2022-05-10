import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CartItem } from './cart';
import { CartService } from './cart.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css'],
})
export class CartsComponent implements OnInit, OnChanges {
  constructor(public cartService: CartService) {}
  cartItemList: CartItem[];
  totalPrice: number;
  ngOnInit(): void {
    this.cartService.getCartItems();
    this.cartItemList = this.cartService.cartItemList;
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
    this.cartService.changeCartItemQuantity(id, quantity);
  }
  deleteCartItem(id: string) {
    this.cartService.deleteCartItems(id);
  }
}
