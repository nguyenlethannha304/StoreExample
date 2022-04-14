import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../interface/products';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-list-render',
  templateUrl: './product-list-render.component.html',
  styleUrls: ['./product-list-render.component.css'],
})
export class ProductListComponentRender implements OnInit {
  @Input() products: ProductCard[];
  constructor() {}

  ngOnInit(): void {}
}
