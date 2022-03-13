import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Observer } from 'rxjs';
import { Message } from '../../interface/message';
import { renderIconToView } from '../../services/icons/icon-functions';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  host: {
    class: 'position-absolute top-0 start-0 w-100 h-100 show',
  },
})
export class MessageComponent implements OnInit, OnDestroy {
  messageContent: string;
  messageLevel: number = -1;
  autoDestroy: boolean = false;
  constructor(
    private el: ElementRef,
    private render: Renderer2,
    public messageSer: MessageService
  ) {}
  @ViewChild('messageContainer') messageContainer: ElementRef;
  @ViewChild('iconContainer') iconContainer: ElementRef;
  @ViewChild('contentContainer') contentContainer: ElementRef;
  ngOnInit(): void {
    this.messageSer.messageSubject.subscribe(this.observer);
  }
  ngOnDestroy(): void {
    this.messageSer.messageSubject.unsubscribe();
  }
  observer: Observer<Message> = {
    next: (message: Message) => {
      this.createMessage(message);
      this.autoDestroy = message.autoDestroy;
    },
    error: (error) => {},
    complete: () => {
      if (this.autoDestroy) {
        // Destroy after 3 seconds
        setTimeout(this.removeMessage, 3000);
      }
    },
  };
  createMessage(message: Message) {
    this.messageLevel = message.level;
    this.messageContent = message.content;
    this.changeMessageClass();
    this.assignIcon();
    // Make message visible
    this.render.addClass(this.messageContainer.nativeElement, 'visible');
  }
  changeMessageClass() {
    let className =
      this.messageSer.messageClass[
        this.messageLevel as keyof typeof this.messageSer.messageClass
      ];
    this.render.addClass(this.messageContainer.nativeElement, className);
  }
  removeMessageClass() {
    let className =
      this.messageSer.messageClass[
        this.messageLevel as keyof typeof this.messageSer.messageClass
      ];
    this.render.removeClass(this.messageContainer.nativeElement, className);
  }
  assignIcon() {
    let iconString =
      this.messageSer.icons[
        this.messageLevel as keyof typeof this.messageSer.icons
      ];
    renderIconToView(iconString, this.iconContainer.nativeElement, this.render);
  }
  unassignIcon() {
    Array.from(this.iconContainer.nativeElement.children).forEach((child) => {
      this.render.removeChild(this.iconContainer.nativeElement, child);
    });
  }

  removeMessage() {
    // Make message inivisible
    this.render.removeClass(this.messageContainer.nativeElement, '');
    this.unassignIcon();
    this.removeMessageClass();
  }
}
