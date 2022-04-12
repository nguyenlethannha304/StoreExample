import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ShareModule } from '../shared/share.module';
import { ProductListComponentRender } from './shared/components/product-list/product-list.component';
import { ProductDetailComponentRender } from './shared/components/product-detail/product-detail.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { SimilarProductsComponent } from './shared/components/similar-products/similar-products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  declarations: [
    ProductListComponentRender,
    ProductDetailComponentRender,
    ProductCardComponent,
    PaginationComponent,
    SimilarProductsComponent,
    ProductListComponent,
    ProductDetailComponent,
  ],
  imports: [CommonModule, ProductsRoutingModule, ShareModule],
})
export class ProductsModule {}
