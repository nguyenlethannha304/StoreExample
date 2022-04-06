import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  host: { class: 'd-flex justify-content-center m-3' },
})
export class PaginationComponent implements OnInit {
  @Input() count: number;
  @Input() offset: number;
  current_page: number;
  numPage: number;
  @Output() changePage = new EventEmitter<number>();
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.numPage = Math.ceil(this.count / this.offset);
    this.route.queryParamMap.subscribe((queryParam) => {
      this.current_page = 1;
      if (queryParam.get('page')) {
        this.current_page = parseInt(queryParam.get('page'));
      }
    });
  }
  hasPrevious(): boolean {
    return this.current_page > 1;
  }
  hasNumberPagePrevious(number: number) {
    return this.current_page - number > 0;
  }
  hasNext(): boolean {
    return this.current_page < this.numPage;
  }
  hasNumberPageNext(number: number): boolean {
    return this.current_page + number <= this.numPage;
  }
  changeToPage(number: number) {
    this.changePage.emit(number);
  }
}
