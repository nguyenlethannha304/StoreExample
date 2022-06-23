import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Renderer2,
} from '@angular/core';
import { renderIconToView } from '../services/icons/icon-functions';
import { closeIcon } from '../services/icons/icons';
@Directive({
  selector: '[CloseButton]',
})
export class CloseButtonDirective implements AfterViewInit {
  constructor(private el: ElementRef, private render: Renderer2) {}
  ngAfterViewInit(): void {
    renderIconToView(this.render, { icon: closeIcon, iconContainer: this.el });
  }
  @HostBinding('class') get class() {
    return 'close-button d-flex align-items-center justify-content-center';
  }
}
