import { Component, Input, OnInit } from '@angular/core';
import { ProductCard } from '../../interface/products';

@Component({
  selector: 'app-similar-products',
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.css'],
})
export class SimilarProductsComponent implements OnInit {
  @Input() similarProducts: ProductCard[];

  constructor() {}

  ngOnInit(): void {}
}
