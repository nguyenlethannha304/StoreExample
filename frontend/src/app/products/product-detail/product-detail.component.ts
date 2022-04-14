import { Component, OnInit } from '@angular/core';
import { ProductCard, ProductDetail } from '../shared/interface/products';
import { ProductService } from '../shared/service/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  constructor(private productService: ProductService) {}
  product: ProductDetail = {
    id: '85dcddf6-7de2-41fc-8564-f11be363b9dc',
    name: 'plastic table',
    rating: 3.8,
    rating_count: 20,
    price: 620765289,
    old_price: 1323584914,
    quantity: 963476691,
    image: null,
    description:
      'ipERmngwytfcgMAtwGGncTPVlkwMuzBfIkNWsqYmMyUXmaBXvsfYzYUuAUrKravzyaUFwXIrXLohfTpYAqWbwdGnmPRVFHvqxJgwhpXrZzBQztgBnenWGLkCJPFiHBVWCmwyCYVExzYYyUTmXLxFqDGeKFhcYsOhkTCyvmGZOQsEypZAYHFuWwAeFaZgktTpeuCLfiyBEoKxqueAUUysNcbQTOQDwSYtmVtZFnWrcjVOiyljGWSjRsaqwjqJelwElXWcStvwaKqRMKjFOQLgbHNOnIjGtyQlsGuRYwoBFSMs',
    type: 2,
  };
  similarProducts: ProductCard[] = [
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
  ngOnInit(): void {}
}
