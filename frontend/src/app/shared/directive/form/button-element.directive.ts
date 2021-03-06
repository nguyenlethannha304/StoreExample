import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'button[ButtonElement]',
})
export class ButtonElementDirective {
  constructor() {}
  @Input() ButtonElement: string; // ButtonElement = 'primary' | 'secondary'
  @Input() Type: string = null;
  @HostBinding('class') get classes() {
    return 'button-custom' + ' ' + this.ButtonElement;
  }
  @HostBinding('type') get type() {
    if (this.Type === null) {
      return 'button';
    } else {
      return this.Type;
    }
  }
}
