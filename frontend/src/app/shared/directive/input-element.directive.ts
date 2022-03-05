import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appInputElement]',
})
export class InputElementDirective {
  constructor() {}
  @HostBinding('class') get classes(): string {
    return 'input-custom';
  }
}
