import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { MobileBottomNavComponent } from './nav/mobile-bottom-nav/mobile-bottom-nav.component';
import { HomeComponent } from './common-pages/home/home.component';
import { AboutComponent } from './common-pages/about/about.component';
import { ShareModule } from './shared/share.module';
import { LoginComponent } from './common-pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    NavComponent,
    MobileBottomNavComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ShareModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
