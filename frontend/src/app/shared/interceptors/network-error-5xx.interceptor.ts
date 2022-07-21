import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import { MessageService } from '../services/message/message.service';
import { Router } from '@angular/router';

@Injectable()
export class NetworkError5xxInterceptor implements HttpInterceptor {
  // Dealing with Response.status = 5xx
  constructor(private messageService:MessageService, private router:Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log(this.router.events)
    return next.handle(request).pipe(catchError((error) => {
      if(error['status'] >= 500){
        this.messageService.createErrorMessage("Máy chủ bị lỗi vui lòng thử lại sau", 5)
        return of(null)
      }
      throw error;
    })
    )
  }
}
