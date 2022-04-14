import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCard, ProductDetail, ProductList } from '../interface/products';
import { environment as e } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}
  getProducts(
    slug: string,
    kind: 't' | 'c',
    page: number,
    offset: number
  ): Observable<ProductList> {
    // slug of type or category
    // kind = t => get products based on type; kind = c => get products based on category
    return this.httpClient.get<ProductList>(
      `${e.api}/products/${kind}/${slug}?page=${page}&offset=${offset}`
    );
  }
  getProduct(uuid: string) {
    // Get a specific products
    return this.httpClient.get<ProductDetail>(`${e.api}/products/${uuid}`);
  }
}
