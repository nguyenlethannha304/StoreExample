import { Component, OnInit } from '@angular/core';
import {
  homeIcon,
  menubarIcon,
  cartIcon,
  userIcon,
} from 'src/app/shared/icons';
@Component({
  selector: 'app-mobile-bottom-nav',
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrls: ['./mobile-bottom-nav.component.css'],
  host: {
    class: 'fixed-bottom d-flex align-items-center d-sm-none p-2',
    style: 'height:4rem; width:100vw; background-color:var(--bs-background)',
  },
})
export class MobileBottomNavComponent implements OnInit {
  homeIcon = homeIcon;
  menubarIcon = menubarIcon;
  cartIcon = cartIcon;
  userIcon = userIcon;
  constructor() {}

  ngOnInit(): void {}
}
