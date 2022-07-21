import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../components/loading-indicator/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequest = 0;
  constructor(private loadingService:LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequest++;
    this.loadingService.setLoading(true)
    return next.handle(request).pipe(
      finalize(()=> {
        this.totalRequest--;
        if(this.totalRequest == 0){
          this.loadingService.setLoading(false)
        }
      })
    );
  }
}
