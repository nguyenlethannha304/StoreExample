import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'div[PanelRow]',
})
export class PanelRowDirective {
  constructor() {}
  @HostBinding('class') get class() {
    return 'panel-row';
  }
}
