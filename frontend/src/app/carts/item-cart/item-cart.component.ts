import { NONE_TYPE } from '@angular/compiler';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Cart, CartItem, Product } from '../cart';
import { trashIcon } from 'src/app/shared/services/icons/icons';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-item-cart',
  templateUrl: './item-cart.component.html',
  styleUrls: ['./item-cart.component.css'],
  host: { class: 'd-flex p-1 ps-3 pe-3 m-0' },
})
export class ItemCartComponent implements OnInit, AfterViewInit {
  @Input('item') cartItem: CartItem;
  @Output() deleteCartItemRequest = new EventEmitter<string>();
  @Output() changeQuantityRequest = new EventEmitter<Partial<CartItem>>();
  quantity: CartItem['quantity'];
  changeQuantitySubject: Subject<Partial<CartItem>>;
  constructor(private render: Renderer2) {
    // Delay send value when change quantity
    this.changeQuantitySubject = new Subject<Partial<CartItem>>();
    this.changeQuantitySubject
      .pipe(debounceTime(2000))
      .subscribe((value) => this.changeQuantityRequest.emit(value));
  }
  ngOnInit(): void {
    this.quantity = this.cartItem.quantity;
  }
  ngAfterViewInit(): void {
    this.render.setProperty(
      this.deleteContainer.nativeElement,
      'innerHTML',
      trashIcon
    );
  }
  getPrice() {
    return this.cartItem.quantity * this.cartItem.product.price;
  }
  changeQuantity(value: number) {
    this.quantity += value;
    this.changeQuantitySubject.next({
      id: this.cartItem.id,
      quantity: this.quantity,
    });
  }
  deleteCartItem() {
    this.deleteCartItemRequest.emit(this.cartItem.id);
  }
  @ViewChild('deleteContainer') deleteContainer: ElementRef;
}
