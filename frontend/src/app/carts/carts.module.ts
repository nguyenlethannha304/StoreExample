import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartsRoutingModule } from './carts-routing.module';
import { CartsComponent } from './carts.component';
import { ShareModule } from '../shared/share.module';
import { ItemCartComponent } from './item-cart/item-cart.component';

@NgModule({
  declarations: [CartsComponent, ItemCartComponent],
  imports: [CommonModule, CartsRoutingModule, ShareModule],
})
export class CartsModule {}
