import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { renderIconToView } from '../../services/icons/icon-functions';
import { searchIcon } from '../../services/icons/icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements AfterViewInit {
  @ViewChild('searchIconContainer') searchIconContainer!: ElementRef;
  constructor(
    private render: Renderer2,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    renderIconToView(this.render, {
      icon: searchIcon,
      iconContainer: this.searchIconContainer,
    });
  }
  searchForm = this.fb.group({
    searchInput: this.fb.control(''),
  });
  submitSearchProduct() {
    let searchValue = this.searchForm.get('searchInput').value;
    this.router.navigate(['products', 'search', searchValue]);
  }
  navigateToHomePage(){
    this.router.navigateByUrl('/')
  }
}
