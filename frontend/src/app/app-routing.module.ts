import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './common-pages/home/home.component';
import { NotFoundComponent } from './common-pages/not-found/not-found.component';
import { PreloadingStrategy } from '@angular/router';
import { Observable, of } from 'rxjs';
class CustomPreloadingStrategy implements PreloadingStrategy {
  // Preload specific module
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data['preload'] ? load() : of(null);
  }
}
const routes: Routes = [
  { path: '', component: HomeComponent },
  // Product Module
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
    data: { preload: true },
  },
  // User Module
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  // Cart Module
  {
    path: 'carts',
    loadChildren: () =>
      import('./carts/carts.module').then((m) => m.CartsModule),
    data: { preload: true },
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
  },
  // 404 NOT FOUND
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
