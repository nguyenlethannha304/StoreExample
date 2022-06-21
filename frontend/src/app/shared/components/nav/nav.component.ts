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
    this.render.setProperty(
      this.searchIconContainer.nativeElement,
      'innerHTML',
      searchIcon
    );
  }
  searchForm = this.fb.group({
    searchInput: this.fb.control(''),
  });
  submitSearchProduct() {
    let searchValue = this.searchForm.get('searchInput').value;
    this.router.navigate(['products', 'search', searchValue]);
  }
}
