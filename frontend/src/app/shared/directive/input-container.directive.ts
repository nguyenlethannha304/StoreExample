import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appInputContainer]',
})
export class InputContainerDirective {
  constructor() {}
  @HostBinding('class') get class(): string {
    return 'input-container mb-3';
  }
}
