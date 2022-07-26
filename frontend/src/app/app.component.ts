import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ResolveEnd, ResolveStart, Router } from '@angular/router';
import { LoadingService } from './shared/components/loading-indicator/loading.service';
import { MessageService } from './shared/services/message/message.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private messageService:MessageService,private router:Router, private loadingService:LoadingService){}
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if(window.innerWidth > 576){
      this.messageService.createErrorWithShadowMessage("Trang web chỉ hỗ trợ điện thoại", 30, null, {isBoxShadowShown:true, boxShadowDestroyMessage:false})
    }
  }
}
