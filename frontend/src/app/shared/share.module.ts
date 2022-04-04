import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputElementDirective } from './directive/form/input-element.directive';
import { ButtonElementDirective } from './directive/form/button-element.directive';
import { InputContainerDirective } from './directive/form/input-container.directive';
import { HideShowInputDirective } from './directive/form/hide-show.directive';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { MobileBottomNavComponent } from './components/nav/mobile-bottom-nav/mobile-bottom-nav.component';
import { ObjectToKeysPipe } from './pipe/object-to-keys.pipe';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './interceptors';
import { MessageComponent } from './components/message/message.component';
import { CloseButtonDirective } from './directive/close-button.directive';
// import './extensions';
import { CurrencyPipe } from './pipe/currency.pipe';
@NgModule({
  declarations: [
    MessageComponent,
    NavComponent,
    FooterComponent,
    InputElementDirective,
    ButtonElementDirective,
    InputContainerDirective,
    HideShowInputDirective,
    MobileBottomNavComponent,
    ObjectToKeysPipe,
    CloseButtonDirective,
    CurrencyPipe,
  ],
  exports: [
    MessageComponent,
    NavComponent,
    FooterComponent,
    InputElementDirective,
    ButtonElementDirective,
    InputContainerDirective,
    HideShowInputDirective,
    MobileBottomNavComponent,
    ObjectToKeysPipe,
    CloseButtonDirective,
    CurrencyPipe,
  ],
  providers: [httpInterceptorProviders],
  imports: [CommonModule, HttpClientModule],
})
export class ShareModule {}
