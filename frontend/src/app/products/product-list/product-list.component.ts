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
    this.productService.products.subscribe((value) => {
      this.products = value.results;
      this.count = value.count;
    });
    this.route.queryParamMap.subscribe((queryParam) => {
      if (queryParam.get('page')) {
        this.page = parseInt(queryParam.get('page'));
      }
      this.route.url.subscribe((urlSegments) => {
        let url = urlSegments.join('/');
        if (url.includes('search')) {
          this.getSearchProducts();
        } else {
          this.getProducts();
        }
        1234;
      });
    });
  }
  getSearchProducts() {
    let searchWords = this.route.snapshot.params['q'];
    this.productService.getSearchProducts(searchWords, this.page, this.offset);
  }
  getProducts() {
    let slug = this.route.snapshot.params['slug'];
    let kind = this.route.snapshot.params['kind'];
    this.productService.getProductList(slug, kind, this.page, this.offset);
  }
  get offset(): number {
    // Default offset
    if (window.innerWidth < 576) {
      return 8;
    }
    return 16;
  }
  changeToPage(number: number) {
    this.page = number;
    this.reRoute();
  }
  private reRoute() {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { page: this.page },
    });
  }
}
