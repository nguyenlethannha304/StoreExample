import { NONE_TYPE } from '@angular/compiler';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CartItem, Product } from '../cart';
import { trashIcon } from 'src/app/shared/services/icons/icons';
@Component({
  selector: 'app-item-cart',
  templateUrl: './item-cart.component.html',
  styleUrls: ['./item-cart.component.css'],
  host: { class: 'd-flex p-1 ps-3 pe-3 m-0' },
})
export class ItemCartComponent implements OnInit, AfterViewInit {
  constructor(private render: Renderer2) {}
  cartItem: CartItem = {
    id: '1234',
    quantity: 10,
    product: {
      id: '1234',
      name: 'ghe voi tieu de dai oi la dai luon a hihihi',
      quantity: 100,
      price: 10000,
      thumbnail: '/assets/example.jpg',
    },
  };
  product: Product;
  ngOnInit(): void {
    this.product = this.cartItem.product;
  }
  ngAfterViewInit(): void {
    this.render.setProperty(
      this.deleteContainer.nativeElement,
      'innerHTML',
      trashIcon
    );
  }
  getPrice() {
    return this.product.price * this.cartItem.quantity;
  }
  decreaseQuantity() {}
  increaseQuantity() {}
  deleteCartItem() {}
  @ViewChild('deleteContainer') deleteContainer: ElementRef;
}
