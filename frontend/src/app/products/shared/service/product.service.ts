import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ProductDetail,
  ProductCard,
  ProductCardList,
} from '../interface/products';
import { environment as e } from 'src/environments/environment';
import { UUID } from 'src/app/shared/interface/share';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: Subject<ProductCardList> = new Subject<ProductCardList>();
  constructor(private httpClient: HttpClient) {}
  getProductList(slug: string, kind: 't' | 'c', page: number, offset: number) {
    // slug of type or category
    // kind = 't' => get products based on type; kind = 'c' => get products based on category
    this.httpClient
      .get<ProductCardList>(
        `${e.api}/products/${kind}/${slug}/?page=${page}&offset=${offset}`
      )
      .subscribe((products) => this.products.next(products));
  }
  getSearchProducts(searchWord: string, page: number, offset: number) {
    this.httpClient
      .get<ProductCardList>(
        `${e.api}/products/search/?q=${searchWord}&offset=${offset}&page=${page}`
      )
      .subscribe((products) => this.products.next(products));
  }
  getProductDetail(uuid: UUID) {
    // Get a specific products
    return this.httpClient.get<ProductDetail>(`${e.api}/products/${uuid}/`);
  }
  getSimilarProducts(type_id: number, exclude_product_id: string) {
    return this.httpClient.get<ProductCard[]>(
      `${e.api}/products/similar_product/${type_id}/${exclude_product_id}/`
    );
  }
}
