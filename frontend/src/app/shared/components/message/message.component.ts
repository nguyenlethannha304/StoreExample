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
    '(click)': 'this.revertMesageType()', //Active hide message
  },
})
export class MessageComponent implements OnInit, OnDestroy {
  flag: boolean = false; //Recognize message destroyed or not
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
    },
    error: (error) => {},
    complete: () => {
      // Destroy after 3 seconds
      setTimeout(this.revertMessageType, 3000);
    },
  };
  createMessage(message: Message) {
    this.changeMessageType(message.level);
    this.assignIcon(message.level);
    this.assignContent(message.content);
    this.flag = true;
  }
  changeMessageType(level: number) {
    if (level == this.messageSer.levels.Sucess) {
      this.render.addClass(
        this.messageContainer.nativeElement,
        'alert-success'
      );
    } else if (level == this.messageSer.levels.Error) {
      this.render.addClass(this.messageContainer.nativeElement, 'alert-danger');
    }
  }
  assignIcon(level: number) {
    this.iconContainer.nativeElement.innerHTML =
      this.messageSer.icons[
        level.toString() as keyof typeof this.messageSer.icons
      ];
  }
  assignContent(content: string) {}
  revertMessageType() {
    if (this.flag == true) {
      let messageContainerE: HTMLElement = this.messageContainer.nativeElement;
      let classListLength = messageContainerE.classList.length;
      // Remove the last class (the one added from changeMessageType())
      messageContainerE.classList.remove(
        `${messageContainerE.classList[classListLength - 1]}`
      );
    }
  }
}
