import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailComponentRender } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponentRender;
  let fixture: ComponentFixture<ProductDetailComponentRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponentRender],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponentRender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
