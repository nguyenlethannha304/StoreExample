import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { MessageService } from '../shared/services/message/message.service';
import { CartItem } from './cart';
import { CartService } from './cart.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css'],
})
export class CartsComponent implements OnInit {
  constructor(
    public cartService: CartService,
    private messageService: MessageService,
    private router: Router
  ) {}
  changeQuantityCartItem$ = new Subject<Partial<CartItem>>();
  ngOnInit(): void {
    this.cartService.getCartItems();
    this.changeQuantityCartItem$
      .pipe(debounceTime(1000))
      .subscribe((cartItem) => {
        this.cartService.changeCartItemQuantity(cartItem.id, cartItem.quantity);
      });
  }
  itemTrackBy(index: number, cartItem: CartItem) {
    return cartItem.id;
  }
  // App item cart output handlers
  public changeQuantityCartItem({ id, quantity }: Partial<CartItem>) {
    this.changeQuantityCartItem$.next({ id, quantity });
  }

  public confirmDeleteCartItem(id: string) {
    let bindDeleteCartItem = this.deleteCartItem.bind(this, id);
    this.messageService.createConfirmMessage(
      'Bạn có muốn xoá sản phẩm này',
      bindDeleteCartItem
    );
  }
  private deleteCartItem(id: string) {
    this.cartService.deleteCartItems(id);
  }
  public validateCartItemAndNavigateToOrder() {
    let errors: String[] = this.validateCartItem();
    if (errors.length > 0) {
      let textError = errors.join('\n');
      this.messageService.createErrorMessage(textError, 5);
      return;
    }
    this.router.navigate(['orders', 'place-order']);
  }
  private validateCartItem(): String[] {
    let errors: String[] = [];
    for (let cartItem of this.cartService.cartItemList) {
      if (cartItem.quantity > cartItem.product.quantity) {
        errors.push(`${cartItem.product.name} vượt quá số lượng cho phép`);
      }
    }
    return errors;
  }
}
