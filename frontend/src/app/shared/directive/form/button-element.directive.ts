import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'button[ButtonElement]',
})
export class ButtonElementDirective {
  constructor() {}
  @Input() ButtonElement: string;
  @HostBinding('class') get classes() {
    return 'button-custom' + ' ' + this.ButtonElement;
  }
}
