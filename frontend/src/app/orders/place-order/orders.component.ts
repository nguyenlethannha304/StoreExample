import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigateService } from '../../shared/services/navigate/navigate.service';
import { OrdersService } from '../orders.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private render: Renderer2,
    private fb: FormBuilder,
    public orderService: OrdersService,
    public navService: NavigateService
  ) {}
  ngOnInit(): void {
    // this.orderService.setOrderItems();
  }
  ngAfterViewInit(): void {
    let icon = this.getCartIcon('#62B0FF');
    this.render.setProperty(
      this.cartIconContainer.nativeElement,
      'innerHTML',
      icon
    );
  }
  ngOnDestroy(): void {
    this.orderService.clearOrderItem();
  }
  // CART-INFORMATION
  // cart icon
  @ViewChild('cartIconContainer') cartIconContainer: ElementRef;
  getCartIcon(hexColor: string) {
    let icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><circle fill="${hexColor}" cx="12.67" cy="28.26" r="1.78"/><circle fill="${hexColor}" cx="24.28" cy="28.26" r="1.78"/><path fill="${hexColor}" d="M30 6.11H10l-.5-3.48H2l.54 2.48H6.9l3 20.82h16.87l.54-2.48H12.55l-.37-2.57h15.58zm-4.09 11.94H11.78l-1.36-9.46h16.89z" stroke-miterlimit="10"/></svg>`;
    return icon;
  }

  isOrderDetailOpen: boolean = false;
  toggleOrderDetail() {
    this.isOrderDetailOpen = !this.isOrderDetailOpen;
  }
  // ADDRESS-FORM
  shippingInformationForm = this.fb.group({
    email: this.fb.control(''),
    phone: this.fb.control(''),
    address: this.fb.group({
      street: this.fb.control(''),
      province: this.fb.control(''),
      city: this.fb.control(''),
    }),
  });
  submitOrder() {}
}
