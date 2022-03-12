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
import { renderIconToView } from 'src/app/shared/services/icons/icon-functions';
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
    renderIconToView(homeIcon, this.homeContainer.nativeElement, this.render);
    renderIconToView(
      menubarIcon,
      this.menuBarContainer.nativeElement,
      this.render
    );
    renderIconToView(cartIcon, this.cartContainer.nativeElement, this.render);
    renderIconToView(userIcon, this.userContainer.nativeElement, this.render);
  }
}
