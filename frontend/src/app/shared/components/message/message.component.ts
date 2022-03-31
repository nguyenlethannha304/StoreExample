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
  @ViewChild('closeButton') closeButton: ElementRef;
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
      this.closeButton.nativeElement;
    },
    error: (error) => {},
    complete: () => {},
  };
  createMessage(message: Message) {
    this.messageLevel = message.level;
    this.messageContent = message.content;
    this.autoDestroy = message.autoDestroy;
    this.changeMessageClass();
    this.assignIcon();
    // Make message visible
    this.render.addClass(this.messageContainer.nativeElement, 'visible');
  }
  messageClassNamePattern = /alert-\w+?/;
  changeMessageClass() {
    // Remove old message class
    Array.from(this.messageContainer.nativeElement.classList).forEach(
      (className) => {
        let match = (className as string).match(this.messageClassNamePattern);
        if (match) {
          this.render.removeClass(
            this.messageContainer.nativeElement,
            match[0]
          );
        }
      }
    );
    // Add new message class
    let className =
      this.messageSer.messageClass[
        this.messageLevel as keyof typeof this.messageSer.messageClass
      ];
    this.render.addClass(this.messageContainer.nativeElement, className);
  }
  assignIcon() {
    // Remove old icon before assign
    Array.from(this.iconContainer.nativeElement.children).forEach((child) => {
      this.render.removeChild(this.iconContainer.nativeElement, child);
    });
    // Assign new icon
    let iconString =
      this.messageSer.icons[
        this.messageLevel as keyof typeof this.messageSer.icons
      ];
    this.render.setProperty(
      this.iconContainer.nativeElement,
      'innerHTML',
      iconString
    );
  }
  removeMessage() {
    if (this.autoDestroy)
      this.render.removeClass(this.messageContainer.nativeElement, 'visible');
  }
  closeButtonClick() {
    this.removeMessage();
  }
}
