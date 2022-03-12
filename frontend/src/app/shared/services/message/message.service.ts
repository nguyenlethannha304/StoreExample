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
  emitMessage = (content: string, level: number) => {
    // level:{1:SUCCESS, 10:DEBUG, 20:INFO, 30:WARNING, 40:ERROR, 50:CRITICAL}
    this.messageSubject.next({ content, level });
  };
}
