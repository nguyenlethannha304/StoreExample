import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCard } from '../../interface/products';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  host: { '(click)': 'onClick()' },
})
export class ProductCardComponent implements OnInit {
  @Input() product: ProductCard;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  onClick() {
    this.router.navigateByUrl('/');
  }
}
