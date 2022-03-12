import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { renderIconToView } from '../../services/icons/icon-functions';
import { searchIcon } from '../../services/icons/icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements AfterViewInit {
  @ViewChild('iconContainer') searchIconContainerRef!: ElementRef;
  constructor(private render: Renderer2) {}

  ngAfterViewInit(): void {
    renderIconToView(
      searchIcon,
      this.searchIconContainerRef.nativeElement,
      this.render
    );
  }
}
