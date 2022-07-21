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
import { environment as e } from 'src/environments/environment';
import { CartService } from 'src/app/carts/cart.service';
@Component({
  selector: 'app-product-detail-render',
  templateUrl: './product-detail-render.component.html',
  styleUrls: ['./product-detail-render.component.css'],
})
export class ProductDetailComponentRender implements OnInit, AfterViewInit {
  @Input() product: ProductDetail;
  allImage:string[] = []
  public environment = e;
  purchaseQuantity: number = 1;
  constructor(
    private render: Renderer2,
    private hostElementRef: ElementRef,
    private cartService: CartService
  ) {}
  @ViewChild('stars') stars: ElementRef;
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.renderStars();
    if (this.product.description) {
      this.preProcessDescription();
    }
  }
  // CART SERVICE
  addToCart() {
    this.cartService.addCartItems(this.product.id, this.purchaseQuantity);
  }
  // RENDER RATING
  renderStars() {
    this.renderGradientForStars();
    let totalStar: string = '';
    for (let i = 0; i < 5; i++) {
      let star: string = starIcon;
      if (this.product.rating >= 1) {
        star = this.renderStar(star, 1);
      } else if (this.product.rating >= 0) {
        star = this.renderStar(star, this.product.rating);
      } else {
        star = this.renderStar(star, 0);
      }
      this.product.rating -= 1;
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
  // Toggle Collapse product description
  // height:auto (can't use transition)
  // 1st: Get initial height of description at normal state and save to this.normalDescriptionHeight => 2nd: Add desciption class to it to limit height to 2rem => 3rd Add and Remove (toggle) its initial height in toggleCollapse()
  @ViewChild('productDescriptionRef') productDescriptionRef: ElementRef;
  normalDescriptionHeight: string;
  descriptionCollapse: boolean = true;
  preProcessDescription() {
    this.getNormalDescriptionHeight();
    let descriptionElement =
      this.productDescriptionRef.nativeElement.querySelector('#description');
    descriptionElement.classList.add('description');
  }
  getNormalDescriptionHeight() {
    let descriptionElement =
      this.productDescriptionRef.nativeElement.querySelector('#description');
    this.normalDescriptionHeight = window
      .getComputedStyle(descriptionElement)
      .getPropertyValue('height');
  }
  toggleCollapse() {
    this.descriptionCollapse = !this.descriptionCollapse;
    let descriptionElement =
      this.productDescriptionRef.nativeElement.querySelector('.description');
    if (descriptionElement.style['height'] !== '') {
      descriptionElement.style['height'] = '';
    } else {
      descriptionElement.style['height'] = this.normalDescriptionHeight;
    }
  }
}
