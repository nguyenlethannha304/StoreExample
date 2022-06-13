import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
import { ProductCard } from '../../interface/products';
import { environment as e } from 'src/environments/environment';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  host: {
    '(click)': 'onClick()',
    class: 'd-flex flex-column align-items-center border border-1 border-dark ',
  },
})
export class ProductCardComponent implements OnInit {
  @Input() product: ProductCard;
  public environment = e;
  constructor(private navSer: NavigateService, private router: Router) {}
  ngOnInit(): void {}
  onClick() {
    this.navSer.navigateTo('products', [this.product.id]);
  }
}
