import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'button[ButtonElement]',
})
export class ButtonElementDirective {
  constructor() {}
  @Input() ButtonElement: string; // ButtonElement = 'primary' | 'secondary'
  @Input() Type = 'button';
  @HostBinding('class') get classes() {
    return 'button-custom' + ' ' + this.ButtonElement;
  }
  @HostBinding('type') get type() {
    return this.Type;
  }
}
