import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private messageSer: MessageService) {}

  ngOnInit(): void {}
}
