import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconHTMLPipe } from './pipe/safe-html.pipe';
import { InputElementDirective } from './directive/input-element.directive';
import { ButtonElementDirective } from './directive/button-element.directive';
import { InputContainerDirective } from './directive/input-container.directive';

@NgModule({
  declarations: [
    SafeIconHTMLPipe,
    InputElementDirective,
    ButtonElementDirective,
    InputContainerDirective,
  ],
  exports: [
    SafeIconHTMLPipe,
    InputElementDirective,
    ButtonElementDirective,
    InputContainerDirective,
  ],
  imports: [CommonModule],
})
export class ShareModule {}
