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
  constructor(
    private productsSer: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProducts();
    console.log(this.products);
  }
  getProducts() {
    let slug = this.route.snapshot.params['slug'];
    let kind = this.route.snapshot.params['kind'];
    this.productsSer.getProducts(slug, kind).subscribe((responseBody) => {
      this.products = responseBody.results;
      this.count = responseBody.count;
    });
  }
}
