import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../shared/interface/products';
import { ProductService } from '../shared/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  // Queryparams
  // get offset();
  page: number = 1;
  // Data
  products: ProductCard[];
  count: number;
  isPagination: boolean = true;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get products
    this.route.queryParamMap.subscribe((queryParam) => {
      if (queryParam.get('page')) {
        this.page = parseInt(queryParam.get('page'));
      }
      this.getProducts();
    });
    // Get Pagination class
    if (this.isPagination) {
    }
  }
  getProducts() {
    let slug = this.route.snapshot.params['slug'];
    let kind = this.route.snapshot.params['kind'];
    let page = this.page;
    let offset = this.offset;
    this.productService
      .getProducts(slug, kind, page, offset)
      .subscribe((responseBody) => {
        this.products = responseBody.results;
        this.count = responseBody.count;
      });
  }
  get offset(): number {
    // Default offset
    if (window.innerWidth < 576) {
      return 8;
    }
    return 16;
  }
  changeToPage(number: number) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { page: number },
    });
  }
}
