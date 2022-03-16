import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
export class MobileBottomNavComponent implements AfterViewInit {
  constructor(public navi: NavigateService, private render: Renderer2) {}
  @ViewChild('homeContainer') homeContainer: ElementRef;
  @ViewChild('menuBarContainer') menuBarContainer: ElementRef;
  @ViewChild('cartContainer') cartContainer: ElementRef;
  @ViewChild('userContainer') userContainer: ElementRef;
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
  }
}
