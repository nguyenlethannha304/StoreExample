import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  { path: 'menu-bar', component: MenuBarComponent },
  { path: 'search/:q', component: ProductListComponent },
  { path: ':kind/:slug', component: ProductListComponent },
  { path: ':uuid', component: ProductDetailComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
