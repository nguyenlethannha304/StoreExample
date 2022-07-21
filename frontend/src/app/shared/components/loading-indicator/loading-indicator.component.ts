import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css'],
  host:{class:'d-flex justify-content-center',}
})
export class LoadingIndicatorComponent implements OnInit {

  constructor(public loadingService:LoadingService) { }

  ngOnInit(): void {
  }

}
