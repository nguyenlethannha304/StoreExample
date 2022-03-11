import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  host: {},
})
export class MessageComponent implements OnInit, OnDestroy {
  constructor(public messageSer: MessageService) {}
  @ViewChild('messageContainer') messageContainer: HTMLDivElement;
  ngOnInit(): void {
    this.messageSer.message$.subscribe(([message, level]: [string, number]) => {
      let messageLevel = this.messageSer.messageLevel;
      if (level == messageLevel.Sucess) {
        this.showSuccessMessage(message);
      } else if ((level = messageLevel.Error)) {
        this.showErrorMessage(message);
      }
    });
  }
  ngOnDestroy(): void {}
  showSuccessMessage(message: string) {
    console.log(`Success: ${message}`);
  }
  showErrorMessage(message: string) {
    console.log(`Error: ${message}`);
  }
  destroyMessage() {}
}
