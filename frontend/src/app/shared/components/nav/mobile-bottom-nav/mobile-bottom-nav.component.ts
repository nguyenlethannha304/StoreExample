import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ObjectUnsubscribedError } from 'rxjs';
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
      'height:4rem; width:100vw; background-color:hsl(var(--cl-secondary-color))',
  },
})
export class MobileBottomNavComponent implements OnInit, AfterViewInit {
  cartCount: number = 0;
  userInApp = {
    home:false,
    products:false,
    orders:false,
    carts:false,
    users:false,
  }
  constructor(
    public navi: NavigateService,
    private render: Renderer2,
    public cartService: CartService,
    private router:Router,
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

    this.router.events.subscribe(value => {if (value instanceof NavigationEnd){
      this.whereIsUser(value.url)
    }})
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
    this.calculateCartCountPosition();
  }
  calculateCartCountPosition() {
    let cartCountContainer =
      this.cartContainer.nativeElement.parentNode.querySelector('.cart-count');
    cartCountContainer.style.right = `0px`;
    cartCountContainer.style.top = `-0.5rem`;
  }
  whereIsUser(url:string){
    let urlArray = url.split('/')
    this.changeUserInAppAttribute(urlArray[1])
  }
  changeUserInAppAttribute(inApp:string){
    Object.keys(this.userInApp).forEach(key => {
      this.userInApp[key as keyof typeof this.userInApp] = false
    })
    if(inApp == ''){
      this.userInApp.home = true
      return
    }
    this.userInApp[inApp as keyof typeof this.userInApp] = true
  }
}
