import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { isPhoneNumberValid } from 'src/app/users/shared/validate/validate';
import { OrderTrackingInformation } from '../orders';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Address } from 'src/app/users/shared/interface/users';
const ORDER_TRACKING_URL = `${environment.api}/orders/check-order`;
const CITY_PROVINCE_INFOR_URL = `${environment.api}/users/city-province-data`;
@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'],
  host: {
    class: 'd-flex flex-column align-content-center  mt-3 mb-3',
    style: 'min-height:60vh',
  },
})
export class OrderTrackingComponent implements OnInit {
  orderTrackingInformation: OrderTrackingInformation = null;
  addressShow: boolean = false;
  phone_number: string = null;
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {}
  getOrderTracking() {
    let order_id = this.orderTrackingForm.get('order_id').value;
    let phone_number = this.orderTrackingForm.get('phone_number').value;
    let URL =
      ORDER_TRACKING_URL + `?order_id=${order_id}&phone_number=${phone_number}`;
    this.http.get<OrderTrackingInformation>(URL).subscribe((body) => {
      this.orderTrackingInformation = body;
      this.phone_number = this.orderTrackingForm.get('phone_number').value;
    });
  }
  orderTrackingForm = this.fb.group({
    order_id: this.fb.control('220618uev49r', Validators.required),
    phone_number: this.fb.control('0979311358', [isPhoneNumberValid()]),
  });
  changeAddressToggle() {
    this.addressShow = !this.addressShow;
  }
}
