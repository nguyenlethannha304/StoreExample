import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/carts/cart';
import { environment as e } from 'src/environments/environment';
@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
  host: { class: 'd-flex mt-2' },
})
export class OrderItemComponent implements OnInit {
  public env = e;
  @Input() orderItem: CartItem;
  constructor() {}

  ngOnInit(): void {}
  getPrice() {
    return this.orderItem.quantity * this.orderItem.product.price;
  }
}
