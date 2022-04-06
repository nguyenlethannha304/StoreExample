import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductCard, ProductList } from '../interface/products';
import { environment as e } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
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
}
