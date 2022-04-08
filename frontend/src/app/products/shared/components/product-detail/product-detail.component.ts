import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ProductDetail } from '../../interface/products';
import {
  starIcon,
  starLinearGradient,
} from 'src/app/shared/services/icons/icons';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  product: ProductDetail = {
    id: '85dcddf6-7de2-41fc-8564-f11be363b9dc',
    name: 'plastic table',
    price: 620765289,
    old_price: 1323584914,
    quantity: 963476691,
    image: null,
    description:
      'ipERmngwytfcgMAtwGGncTPVlkwMuzBfIkNWsqYmMyUXmaBXvsfYzYUuAUrKravzyaUFwXIrXLohfTpYAqWbwdGnmPRVFHvqxJgwhpXrZzBQztgBnenWGLkCJPFiHBVWCmwyCYVExzYYyUTmXLxFqDGeKFhcYsOhkTCyvmGZOQsEypZAYHFuWwAeFaZgktTpeuCLfiyBEoKxqueAUUysNcbQTOQDwSYtmVtZFnWrcjVOiyljGWSjRsaqwjqJelwElXWcStvwaKqRMKjFOQLgbHNOnIjGtyQlsGuRYwoBFSMs',
    type: 2,
  };
  rating: number = 3.8;
  rating_count: number = 20;
  constructor(private render: Renderer2, private hostElementRef: ElementRef) {}
  @ViewChild('stars') stars: ElementRef;
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.renderStars();
  }
  renderStars() {
    this.renderGradientForStars();
    let totalStar: string = '';
    for (let i = 0; i < 5; i++) {
      let star: string = starIcon;
      if (this.rating >= 1) {
        star = this.renderStar(star, 1);
      } else if (this.rating >= 0) {
        star = this.renderStar(star, this.rating);
      } else {
        star = this.renderStar(star, 0);
      }
      console.log(star);
      this.rating -= 1;
      totalStar += star;
    }
    this.render.setProperty(this.stars.nativeElement, 'innerHTML', totalStar);
  }
  renderGradientForStars() {
    let starGradientDef = this.render.createElement('svg', 'svg');
    this.render.setAttribute(starGradientDef, 'class', 'w-0 h-0 m-0 p-0');
    this.render.setProperty(starGradientDef, 'innerHTML', starLinearGradient);
    this.render.appendChild(this.hostElementRef.nativeElement, starGradientDef);
  }
  renderStar(star: string, number: number): string {
    if (number == 1) {
      return star.replace('(#linear-gradient)', '(#linear-gradient-1.0)');
    } else if (number == 0) {
      return star.replace('(#linear-gradient)', '(#linear-gradient-0.0)');
    } else if (number > 0 && number < 0.5) {
      return star.replace('(#linear-gradient)', '(#linear-gradient-0.25)');
    } else {
      return star.replace('(#linear-gradient)', '(#linear-gradient-0.75)');
    }
  }
  discount(): string {
    let discountPercentage: number =
      ((this.product.old_price - this.product.price) / this.product.old_price) *
      100;
    return `${discountPercentage.toFixed(0)}%`;
  }
}
