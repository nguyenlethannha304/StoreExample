import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import { ProductCard } from '../../interface/products';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  host: { '(click)': 'onClick()' },
})
export class ProductCardComponent implements OnInit {
  @Input() product: ProductCard;
  constructor(private navSer: NavigateService) {}

  ngOnInit(): void {}
  onClick() {
    this.navSer.navigateTo('products', [this.product.id]);
  }
}
