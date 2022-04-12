import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../interface/products';
import { ProductsService } from '../../service/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponentRender implements OnInit {
  // Queryparams
  page: number = 1;
  // get offset();

  // Data
  products: ProductCard[];
  count: number;
  // Use pagination to divive products
  isPagination: boolean = true;
  constructor(
    private productsSer: ProductsService,
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
    this.productsSer
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
