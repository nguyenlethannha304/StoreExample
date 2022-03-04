import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconHTMLPipe } from './pipe/safe-html.pipe';
import { IconDirective } from './icons/icon.directive';

@NgModule({
  declarations: [SafeIconHTMLPipe, IconDirective],
  exports: [SafeIconHTMLPipe, IconDirective],
  imports: [CommonModule],
})
export class ShareModule {}
