import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  host: {
    class: 'd-flex flex-column align-items-center justify-content-center',
  },
})
export class NotFoundComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {}
  navigateToHome() {
    this.route.navigate(['/']);
  }
}
