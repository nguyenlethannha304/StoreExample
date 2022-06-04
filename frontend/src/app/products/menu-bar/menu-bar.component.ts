import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBar } from '../shared/interface/products';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent implements OnInit, AfterViewInit {
  menuBarData: MenuBar[] = [
    {
      name: 'Ghế',
      slug: 'ghe',
      types: [
        {
          name: 'Ghế nhựa',
          slug: 'ghe-nhua',
        },
        {
          name: 'Ghế gỗ',
          slug: 'ghe-go',
        },
      ],
    },
    {
      name: 'Bàn',
      slug: 'ban',
      types: [
        {
          name: 'Bàn nhựa',
          slug: 'ban-nhua',
        },
        {
          name: 'Bàn gỗ',
          slug: 'ban-go',
        },
      ],
    },
  ];
  constructor(private elementRef: ElementRef, private router: Router) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
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
