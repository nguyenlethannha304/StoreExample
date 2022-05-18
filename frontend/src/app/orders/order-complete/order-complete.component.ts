import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css'],
})
export class OrderCompleteComponent implements OnInit {
  constructor(private router: Router) {
    console.log(this.router.getCurrentNavigation().extras);
  }

  ngOnInit(): void {}
}
