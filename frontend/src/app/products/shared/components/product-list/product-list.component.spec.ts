import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponentRender } from './product-list.component';

describe('ProductListComponentRender', () => {
  let component: ProductListComponentRender;
  let fixture: ComponentFixture<ProductListComponentRender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponentRender],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponentRender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
