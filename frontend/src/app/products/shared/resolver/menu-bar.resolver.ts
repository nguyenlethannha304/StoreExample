import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MenuBar } from '../interface/products';
import { ProductService } from '../service/product.service';

@Injectable({
  providedIn: 'root',
})
export class MenuBarResolver implements Resolve<MenuBar[]> {
  constructor(private productService: ProductService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MenuBar[]> {
    return this.productService.getMenuBar();
  }
}
