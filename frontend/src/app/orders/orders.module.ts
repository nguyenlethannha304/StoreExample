import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { ShareModule } from '../shared/share.module';
import { OrderItemComponent } from './order-item/order-item.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrdersComponent, OrderItemComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ShareModule,
    ReactiveFormsModule,
  ],
})
export class OrdersModule {}
