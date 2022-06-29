import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserOrder } from '../shared/interface/users';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  userOrder: UserOrder['orders'] = [];
  userPhone: UserOrder['phone'] = null;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserOrders().subscribe((body) => {
      this.userOrder = body.orders;
      this.userPhone = body.phone;
    });
  }
  navigateToOrderTracking(id: string) {
    this.router.navigate(['orders', 'tra-cuu-don-hang'], {
      queryParams: { id: id, phone: this.userPhone },
    });
  }
}
