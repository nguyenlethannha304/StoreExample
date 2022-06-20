import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';
import { ProductCard, ProductDetail } from '../shared/interface/products';
import { ProductService } from '../shared/service/product.service';
import { environment as e } from 'src/environments/environment';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  uuid: ProductDetail['id'];
  product: ProductDetail;
  similarProducts: ProductCard[] = null;
  ngOnInit(): void {
    this.route.params.subscribe((value) =>
      this.getProductDetail(value['uuid'])
    );
  }
  getProductDetail(uuid: ProductDetail['id']) {
    this.productService.getProductDetail(uuid).subscribe((responseBody) => {
      this.product = responseBody;
      this.getSimilarProduct(this.product.type, this.product.id);
    });
  }
  getSimilarProduct(type_id: number, exclude_product_id: string) {
    this.productService
      .getSimilarProducts(type_id, exclude_product_id)
      .subscribe((products) => {
        this.similarProducts = products;
      });
  }
}
