import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ShareModule } from '../shared/share.module';
import { ProductListComponent } from './shared/components/product-list/product-list.component';
import { ProductDetailComponent } from './shared/components/product-detail/product-detail.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductCardComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, ProductsRoutingModule, ShareModule],
})
export class ProductsModule {}
