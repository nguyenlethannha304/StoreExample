import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  homeIcon,
  menubarIcon,
  cartIcon,
  userIcon,
} from 'src/app/shared/icons/icons';
import { getUrlFromName } from 'src/app/shared/navigate/navigate-functions';
@Component({
  selector: 'app-mobile-bottom-nav',
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrls: ['./mobile-bottom-nav.component.css'],
  host: {
    class: 'fixed-bottom d-flex align-items-center d-sm-none p-2',
    style:
      'height:4rem; width:100vw; background-color:hsl(var(--bs-background))',
  },
})
export class MobileBottomNavComponent implements OnInit {
  homeIcon = homeIcon;
  menubarIcon = menubarIcon;
  cartIcon = cartIcon;
  userIcon = userIcon;
  constructor(private route: Router) {}

  ngOnInit(): void {}
  navigateTo(viewName: string) {
    let url = getUrlFromName(viewName);
    this.route.navigate([url]);
  }
}
