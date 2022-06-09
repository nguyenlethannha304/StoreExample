import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CartService } from 'src/app/carts/cart.service';
import {
  homeIcon,
  menubarIcon,
  cartIcon,
  userIcon,
  successIcon,
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
  @ViewChild('cartContainer') cartContainer: ElementRef;
  @ViewChild('userContainer') userContainer: ElementRef;
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(
      (cartCount) => (this.cartCount = cartCount)
    );
  }
  ngAfterViewInit(): void {
    this.render.setProperty(
      this.homeContainer.nativeElement,
      'innerHTML',
      homeIcon
    );
    this.render.setProperty(
      this.menuBarContainer.nativeElement,
      'innerHTML',
      menubarIcon
    );
    this.render.setProperty(
      this.cartContainer.nativeElement,
      'innerHTML',
      cartIcon
    );
    this.render.setProperty(
      this.userContainer.nativeElement,
      'innerHTML',
      userIcon
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
