import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './place-order/orders.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
const routes: Routes = [
  { path: 'dat-hang', component: OrdersComponent },
  { path: 'tra-cuu-don-hang', component: OrderTrackingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
