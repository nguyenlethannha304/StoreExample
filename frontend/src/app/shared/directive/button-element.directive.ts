import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appButtonElement]',
})
export class ButtonElementDirective {
  constructor() {}
  @Input() appButtonElement: string;
  @HostBinding('class') get classes() {
    return 'button-custom' + ' ' + this.appButtonElement;
  }
}
