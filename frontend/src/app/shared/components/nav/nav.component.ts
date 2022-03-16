import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { searchIcon } from '../../services/icons/icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements AfterViewInit {
  @ViewChild('iconContainer') searchIconContainer!: ElementRef;
  constructor(private render: Renderer2) {}

  ngAfterViewInit(): void {
    this.render.setProperty(
      this.searchIconContainer.nativeElement,
      'innerHTML',
      searchIcon
    );
  }
}
