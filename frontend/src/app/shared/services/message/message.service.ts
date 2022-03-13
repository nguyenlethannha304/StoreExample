import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../../interface/message';
import { successIcon, errorIcon } from '../icons/icons';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageClass = {
    1: 'alert-sucess',
    40: 'alert-danger',
  };
  icons = {
    1: successIcon,
    40: errorIcon,
  };
  messageSubject = new Subject<Message>();
  constructor() {}
  showMessage = (content: string, level: 1 | 40, autoDestroy: boolean) => {
    this.messageSubject.next({ content, level, autoDestroy });
  };
  showSuccessAutoDestroyMessage = (
    content: string,
    level: 1 = 1,
    autoDestroy = true
  ) => {
    this.showMessage(content, level, autoDestroy);
  };
}
