import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageLevel = {
    Sucess: 1,
    Debug: 10,
    Info: 20,
    Warning: 30,
    Error: 40,
    Critical: 50,
  };
  message$: Observable<[string, number]>;
  constructor() {}
  emitMessage = (message: string, level: number) => {
    // level:{1:SUCCESS, 10:DEBUG, 20:INFO, 30:WARNING, 40:ERROR, 50:CRITICAL}
    this.message$ = of([message, level]);
  };
}
