import { Component, OnInit } from '@angular/core';
import { ProductList } from '../../interface/products';

@Component({
  selector: 'app-similar-products',
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.css'],
})
export class SimilarProductsComponent implements OnInit {
  products: ProductList['results'] = [
    {
      id: 'bfaab8db-d97b-4582-8f18-c8afd5417513',
      price: 92648695,
      thumbnail: null,
    },
    {
      id: '2f564397-eaa5-4437-a3e9-45948332f24d',
      price: 875324594,
      thumbnail: null,
    },
    {
      id: '9013c3ee-583f-47af-b2d4-6489fd5bade7',
      price: 212558569,
      thumbnail: null,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
