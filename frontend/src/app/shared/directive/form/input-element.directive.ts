import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'input[InputElement]',
})
export class InputElementDirective {
  constructor() {}
  @HostBinding('class') get classes(): string {
    return 'input-custom';
  }
}
