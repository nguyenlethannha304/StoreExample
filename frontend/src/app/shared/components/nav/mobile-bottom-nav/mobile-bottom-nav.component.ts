import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CartService } from 'src/app/carts/cart.service';
import { renderIconToView } from 'src/app/shared/services/icons/icon-functions';
import {
  homeIcon,
  menubarIcon,
  cartIcon,
  userIcon,
  successIcon,
  orderTrackingIcon,
} from 'src/app/shared/services/icons/icons';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
@Component({
  selector: 'app-mobile-bottom-nav',
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrls: ['./mobile-bottom-nav.component.css'],
  host: {
    class: 'fixed-bottom d-flex align-items-center d-sm-none p-2',
    style:
      'height:4rem; width:100vw; background-color:hsl(var(--cl-background))',
  },
})
export class MobileBottomNavComponent implements OnInit, AfterViewInit {
  cartCount: number = 0;
  constructor(
    public navi: NavigateService,
    private render: Renderer2,
    public cartService: CartService
  ) {}
  @ViewChild('homeContainer') homeContainer: ElementRef;
  @ViewChild('menuBarContainer') menuBarContainer: ElementRef;
  @ViewChild('orderTrackingContainer') orderTrackingContainer: ElementRef;
  @ViewChild('cartContainer') cartContainer: ElementRef;
  @ViewChild('userContainer') userContainer: ElementRef;
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(
      (cartCount) => (this.cartCount = cartCount)
    );
  }
  ngAfterViewInit(): void {
    renderIconToView(
      this.render,
      { icon: homeIcon, iconContainer: this.homeContainer },
      { icon: menubarIcon, iconContainer: this.menuBarContainer },
      { icon: orderTrackingIcon, iconContainer: this.orderTrackingContainer },
      { icon: cartIcon, iconContainer: this.cartContainer },
      { icon: userIcon, iconContainer: this.userContainer }
    );
    this.calculate_left_attribute_cartCount();
  }
  calculate_left_attribute_cartCount() {
    let cartIcon = this.cartContainer.nativeElement.querySelector('path');
    let leftAttribute = cartIcon.getBoundingClientRect().x;
    let countNumber =
      this.cartContainer.nativeElement.parentNode.querySelector('.cart-count');
    countNumber.style.left = `${leftAttribute + 32}px`;
  }
}
