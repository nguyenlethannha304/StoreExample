import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { searchIcon } from '../../icons/icons';
import { resizeIcon } from '../../icons/icon-functions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, AfterViewInit {
  @ViewChild('iconContainer') searchIconContainerRef!: ElementRef;
  searchIcon = searchIcon;
  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    resizeIcon(this.searchIconContainerRef, '1.125rem');
  }
}
