import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ShareModule } from '../shared/share.module';
import { ProductListComponentRender } from './shared/components/product-list-render/product-list-render.component';
import { ProductDetailComponentRender } from './shared/components/product-detail-render/product-detail-render.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { SimilarProductsComponent } from './shared/components/similar-products/similar-products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductListComponentRender,
    ProductDetailComponentRender,
    ProductCardComponent,
    PaginationComponent,
    SimilarProductsComponent,
    ProductListComponent,
    ProductDetailComponent,
    MenuBarComponent,
  ],
  imports: [CommonModule, ProductsRoutingModule, ShareModule, FormsModule],
})
export class ProductsModule {}
