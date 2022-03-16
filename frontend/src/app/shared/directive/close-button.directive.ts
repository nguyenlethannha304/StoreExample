import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Renderer2,
} from '@angular/core';
import { closeIcon } from '../services/icons/icons';
@Directive({
  selector: '[CloseButton]',
})
export class CloseButtonDirective implements AfterViewInit {
  constructor(private el: ElementRef, private render: Renderer2) {}
  ngAfterViewInit(): void {
    this.render.setProperty(this.el.nativeElement, 'innerHTML', closeIcon);
  }
  @HostBinding('class') get class() {
    return 'close-button d-flex align-items-center justify-content-center';
  }
}
