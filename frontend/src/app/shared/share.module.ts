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
import { SelectDirective } from './directive/form/select.directive';
import { CurrencyPipe } from './pipe/currency.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
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
    SelectDirective,
    LoadingIndicatorComponent,
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
    SelectDirective,
    LoadingIndicatorComponent
  ],
  providers: [httpInterceptorProviders],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
})
export class ShareModule {}
