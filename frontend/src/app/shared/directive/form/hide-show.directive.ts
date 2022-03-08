import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { hideInputIcon, showInputIcon } from '../../icons/icons';
import { positionIconIntoElement } from '../../icons/icon-functions';
@Directive({
  selector: 'div[HideShowInput]',
})
export class HideShowInputDirective implements AfterViewInit {
  // toggle input type between password and text
  constructor(private el: ElementRef) {
    el.nativeElement.innerHTML = showInputIcon + hideInputIcon;
  }
  @Input() TargetElement: HTMLInputElement;
  ngAfterViewInit(): void {
    positionIconIntoElement(
      this.el.nativeElement.parentNode,
      this.el.nativeElement,
      'right bottom'
    );
  }

  @HostBinding('class') get class() {
    return 'hide-show-input';
  }
  @HostListener('click') onClick() {
    if (this.TargetElement.type == 'password') {
      this.TargetElement.type = 'text';
      this.el.nativeElement.classList.add('show-input');
    } else {
      this.TargetElement.type = 'password';
      this.el.nativeElement.classList.remove('show-input');
    }
  }
}
