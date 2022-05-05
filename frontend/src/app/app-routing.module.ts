import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './common-pages/home/home.component';
import { NotFoundComponent } from './common-pages/not-found/not-found.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  // Product Module
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule),
  },
  // User Module
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  { path: 'carts', loadChildren: () => import('./carts/carts.module').then(m => m.CartsModule) },
  // 404 NOT FOUND
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
