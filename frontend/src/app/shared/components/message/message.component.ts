import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Message, MessageOptions } from '../../interface/message';
import { renderIconToView } from '../../services/icons/icon-functions';
import { errorIcon, successIcon } from '../../services/icons/icons';
import { MessageService } from '../../services/message/message.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  host: { class: 'd-none position-fixed top-0 left-0' },
})
export class MessageComponent implements OnInit {
  message: Message;
  icon: string;
  content: string;
  actionFunction: Function = null;
  // boxShadow atributes
  isBoxShadowShown: boolean;
  boxShadowDestroMessage: boolean;
  // Time out for destroy message
  destroyMessageTimeOut: null | ReturnType<typeof setTimeout> = null;
  constructor(
    private hostElement: ElementRef,
    private messageService: MessageService,
    private render: Renderer2
  ) {}
  ngOnInit(): void {
    this.messageService.message.subscribe((message) => {
      this.message = message;
      this.renderMessage();
    });
  }
  renderMessage() {
    this.resetMessage();
    this.renderMessageDirector();
    this.showMessageComponent();
    this.setTimeDestroyMessage(this.message.duration);
  }
  destroyMessage(destroy: boolean = true) {
    if (destroy) {
      this.hideMessageComponent();
      clearTimeout(this.destroyMessageTimeOut);
    }
  }
  resetMessage() {
    this.setIcon('');
    this.setContent('');
    this.setActionButton(null);
    this.destroyMessageTimeOut = null;
  }
  private showMessageComponent() {
    this.hostElement.nativeElement.classList.remove('d-none');
  }
  private hideMessageComponent() {
    this.hostElement.nativeElement.classList.add('d-none');
  }
  private setTimeDestroyMessage(duration: number) {
    this.destroyMessageTimeOut = setTimeout(
      () => this.destroyMessage(),
      duration * 1000
    );
  }
  // MESSAGE BUILDER
  private renderMessageDirector() {
    this.setGeneral();
    if (this.message.level == 20) {
      return this.renderSuccessMessageBuilder();
    }
    if (this.message.level == 21) {
      return this.renderConfirmMessageBuilder();
    }
    if (this.message.level == 40) {
      return this.renderErrorMessageBuilder();
    }
    console.error('New type of message discovered');
  }
  private renderSuccessMessageBuilder() {
    this.setIcon(successIcon);
    this.setContent(this.message.content);
  }
  private renderErrorMessageBuilder() {
    this.setIcon(errorIcon);
    this.setContent(this.message.content);
  }
  private renderConfirmMessageBuilder() {
    this.setContent(this.message.content);
    this.setActionButton(this.message.actionFunction);
  }
  // BUILDER STEP
  @ViewChild('iconContainer') iconContainer: ElementRef;
  setIcon(icon: string) {
    // set icon to html
    this.icon = icon;
    renderIconToView(this.render, {
      icon: this.icon,
      iconContainer: this.iconContainer,
    });
  }
  setContent(content: string) {
    this.content = content;
  }
  setActionButton(actionFunction: Function) {
    this.actionFunction = actionFunction;
  }
  setGeneral() {
    this.boxShadowDestroMessage =
      this.message.messageOptions['boxShadowDestroMessage'];
    this.isBoxShadowShown = this.message.messageOptions['isBoxShadowShown'];
  }
  //
}
