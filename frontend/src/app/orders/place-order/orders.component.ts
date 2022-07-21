import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { zip } from 'rxjs';
import { CartItem } from 'src/app/carts/cart';
import { CartService } from 'src/app/carts/cart.service';
import { AddressService } from 'src/app/shared/services/addresss/address.service';
import { renderIconToView } from 'src/app/shared/services/icons/icon-functions';
import { UserService } from 'src/app/users/shared/user.service';
import {
  isEmailValid,
  isPhoneNumberValid,
  required,
} from 'src/app/users/shared/validate/validate';
import { NavigateService } from '../../shared/services/navigate/navigate.service';
import { LogInUserAddress, ShippingInformation } from '../orders';
import { OrdersService } from '../orders.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  public cartItemList: CartItem[] = [];
  public canUseUserAddress = false;
  public useUserAddress = false;
  public userInformation: LogInUserAddress;
  constructor(
    private render: Renderer2,
    private fb: FormBuilder,
    public addressService: AddressService,
    public orderService: OrdersService,
    public cartService: CartService,
    public navService: NavigateService,
    public userService: UserService
  ) {}
  ngOnInit(): void {
    this.cartService.cartItemList$.subscribe(
      (cartItemList) => (this.cartItemList = cartItemList)
    );
    this.cartService.getCartItems();
    this.addressService.getProvinceCityData$().subscribe((_) => _);
    this.setUpUserAddress();
  }
  ngAfterViewInit(): void {
    let icon = this.getCartIcon('#62B0FF');
    renderIconToView(this.render, {
      icon: icon,
      iconContainer: this.cartIconContainer,
    });
  }

  ngOnDestroy(): void {
    this.orderService.clearOrderItem();
  }
  // SET UP DEFAULT ADDRESS FOR USER
  useUserAddressChange(event: any) {
    this.useUserAddress = !event.target.checked;
  }
  setUpUserAddress(): void {
    zip(
      this.userService.getProfileInformation$(),
      this.userService.getUserEmail()
    ).subscribe(([profile, email]) => {
      if (
        profile != null &&
        profile.phone &&
        profile.street &&
        profile.city &&
        profile.province
      ) {
        this.canUseUserAddress = true;
        this.useUserAddress = true;
        this.userInformation = {
          email,
          phone: profile.phone,
          street: profile.street,
          city: profile.city,
          province: profile.province,
        };
      }
    });
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
    email: this.fb.control('', [required(),isEmailValid()]),
    phone: this.fb.control('', [required(),isPhoneNumberValid()]),
    address: this.fb.group({
      street: this.fb.control('', [required()]),
      province: this.fb.control('', [required()]),
      city: this.fb.control('', [required()]),
    }),
  });
  get email() {
    return this.shippingInformationForm.get('email');
  }
  get phone() {
    return this.shippingInformationForm.get('phone');
  }
  get address() {
    return this.shippingInformationForm.get('address') as FormGroup;
  }
  get province() {
    return this.address.get('province');
  }
  get city() {
    return this.address.get('city');
  }
  updateCityInformation() {
    this.addressService.getCityData(this.province.value);
    this.city.setValue('');
  }
  submitOrder() {
    if (this.shippingInformationForm.valid || this.useUserAddress) {
      let shippingInformation = this.getShippingInformation();
      this.orderService.submitOrder(shippingInformation);
    }
  }
  private getShippingInformation(): ShippingInformation {
    let email = this.email.value;
    let phone_number = this.phone.value;
    let address = {
      street: this.address.get('street').value,
      province: this.province.value,
      city: this.city.value,
    };
    let use_profile_contact = this.useUserAddress;
    return { email, phone_number, address, use_profile_contact };
  }
}
