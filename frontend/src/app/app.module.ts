import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './common-pages/not-found/not-found.component';

import { HomeComponent } from './common-pages/home/home.component';
import { AboutComponent } from './common-pages/about/about.component';
import { ShareModule } from './shared/share.module';
// Import Extension for String
import 'src/app/shared/extensions/string.extensions';
import { httpInterceptorProviders } from './shared/interceptors';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    AboutComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ShareModule],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
