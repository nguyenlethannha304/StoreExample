import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuBar } from '../shared/interface/products';
import { ProductService } from '../shared/service/product.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent implements OnInit, AfterViewInit {
  menuBarData: MenuBar[] = [];
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ menuBar }) => {
      this.menuBarData = menuBar;
    });
  }
  ngAfterViewInit(): void {
    // Toggle categories
    let categoryDivs = <HTMLDivElement[]>(
      this.elementRef.nativeElement.querySelectorAll('.category-name')
    );
    categoryDivs.forEach((categoryDiv) => {
      categoryDiv.addEventListener('click', () => {
        categoryDiv.parentElement.classList.toggle('show');
      });
    });
  }
  navigateToProductList(slug: string, type: string) {
    this.router.navigate(['products', type, slug]);
  }
}
