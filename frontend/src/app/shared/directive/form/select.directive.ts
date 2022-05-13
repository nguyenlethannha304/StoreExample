import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'select[selectElement]',
})
export class SelectDirective {
  constructor(private el: ElementRef) {}
  @HostBinding('class') get classes(): string {
    return 'select-custom';
  }
}
