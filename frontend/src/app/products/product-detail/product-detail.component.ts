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
  ngOnInit(): void {
    this.route.params.subscribe((value) =>
      this.getProductDetail(value['uuid'])
    );
  }
  getProductDetail(uuid: ProductDetail['id']) {
    this.productService.getProductDetail(uuid).subscribe((responseBody) => {
      this.product = responseBody;
    });
  }
}
