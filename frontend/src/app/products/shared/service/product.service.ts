import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetail, ProductCardList } from '../interface/products';
import { environment as e } from 'src/environments/environment';
import { UUID } from 'src/app/shared/interface/share';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}
  getProductList(
    slug: string,
    kind: 't' | 'c',
    page: number,
    offset: number
  ): Observable<ProductCardList> {
    // slug of type or category
    // kind = 't' => get products based on type; kind = 'c' => get products based on category
    return this.httpClient.get<ProductCardList>(
      `${e.api}/products/${kind}/${slug}/?page=${page}&offset=${offset}`
    );
  }
  getProductDetail(uuid: UUID) {
    // Get a specific products
    return this.httpClient.get<ProductDetail>(`${e.api}/products/${uuid}/`);
  }
}
