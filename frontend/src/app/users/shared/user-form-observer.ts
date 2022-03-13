import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { MessageService } from 'src/app/shared/services/message/message.service';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';

export class UserFormObserver {
  constructor(
    private messageContent: string,
    private errorFormContainer: HTMLElement,
    private navigateURL: string,
    private navSer: NavigateService,
    private mesageSer: MessageService,
    private render: Renderer2
  ) {}
  create = () => {
    return {
      next: () => {
        this.mesageSer.showAutoDestroyMessage(this.messageContent, 1);
      },
      error: (error: string) => {},
      complete: () => {
        if (this.navigateURL != '') {
          this.navSer.navigateTo(this.navigateURL);
        }
      },
    };
  };
}
