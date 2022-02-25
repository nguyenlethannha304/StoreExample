import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { MobileBottomNavComponent } from './nav/mobile-bottom-nav/mobile-bottom-nav.component';
import { SafeIconHTMLPipe } from './shared/pipe/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    NavComponent,
    MobileBottomNavComponent,
    FooterComponent,
    SafeIconHTMLPipe,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
