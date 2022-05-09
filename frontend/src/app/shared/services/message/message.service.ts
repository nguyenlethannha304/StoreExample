import { Injectable, OnInit } from '@angular/core';
import { ObjectUnsubscribedError, Observable, of, Subject } from 'rxjs';
import { Message, MessageOptions } from '../../interface/message';
export const MESSAGE_LEVELS = {
  10: 'DEBUG',
  20: 'INFO',
  21: 'CONFIRM',
  30: 'WARNING',
  40: 'ERROR',
  50: 'CRITICAL',
};
const DEFAULT_MESSAGE_OPTIONS: MessageOptions = {
  isBoxShadowShown: false,
  boxShadowDestroyMessage: true,
};
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  message: Subject<Message> = new Subject<Message>();
  createSucessMessage(content: string, duration: number = 2) {
    this.messageFactoryMethod(content, 20, duration);
  }
  createErrorMessage(content: string, duration: number = 2) {
    this.messageFactoryMethod(content, 40, duration);
  }
  createConfirmMessage(content: string, actionFunction: Function) {
    this.messageFactoryMethod(content, 21, 3600, actionFunction, {
      isBoxShadowShown: true,
      boxShadowDestroyMessage: false,
    });
  }
  private messageFactoryMethod(
    content: string,
    level: number,
    duration: number = 2,
    actionFunction: Function = null,
    options: Partial<MessageOptions> = {}
  ): void {
    let messageOptions = this.getOptions(options);
    this.message.next({
      content,
      level,
      duration,
      actionFunction,
      messageOptions,
    });
  }
  getOptions(options: Partial<MessageOptions>): MessageOptions {
    let messageOptions = Object.assign({}, DEFAULT_MESSAGE_OPTIONS);
    for (const [key, value] of Object.entries(options)) {
      if (key in messageOptions) {
        messageOptions[key] = value;
      }
    }
    return messageOptions;
  }
  destroyMessage() {}
}
