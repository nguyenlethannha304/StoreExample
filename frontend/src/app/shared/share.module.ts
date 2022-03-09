import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconHTMLPipe } from './pipe/safe-html.pipe';
import { InputElementDirective } from './directive/form/input-element.directive';
import { ButtonElementDirective } from './directive/form/button-element.directive';
import { InputContainerDirective } from './directive/form/input-container.directive';
import { HideShowInputDirective } from './directive/form/hide-show.directive';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { MobileBottomNavComponent } from './components/nav/mobile-bottom-nav/mobile-bottom-nav.component';
import { ObjectToKeysPipe } from './pipe/object-to-keys.pipe';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    SafeIconHTMLPipe,
    InputElementDirective,
    ButtonElementDirective,
    InputContainerDirective,
    HideShowInputDirective,
    NavComponent,
    MobileBottomNavComponent,
    FooterComponent,
    ObjectToKeysPipe,
  ],
  exports: [
    SafeIconHTMLPipe,
    InputElementDirective,
    ButtonElementDirective,
    InputContainerDirective,
    HideShowInputDirective,
    NavComponent,
    MobileBottomNavComponent,
    FooterComponent,
    ObjectToKeysPipe,
  ],
  imports: [CommonModule, HttpClientModule],
})
export class ShareModule {}
