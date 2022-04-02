import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../interface/products';
import { ProductsService } from '../../service/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: ProductCard[];
  count: number;
  constructor(private productsSer: ProductsService) {}

  ngOnInit(): void {}
  getProducts() {
    this.productsSer.getProducts().subscribe((responseBody) => {
      this.products = responseBody.results;
      this.count = responseBody.count;
    });
  }
}
