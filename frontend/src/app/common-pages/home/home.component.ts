import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'src/app/shared/services/message/message.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categoryData = [
    { slug: 'Ten-muc-hang-hoa', name: 'Tên mục hàng hoá', icon: 'Icon' },
    { slug: 'Ten-muc-hang-hoa', name: 'Tên mục hàng hoá', icon: 'Icon' },
    { slug: 'Ten-muc-hang-hoa', name: 'Tên mục hàng hoá', icon: 'Icon' },
    { slug: 'Ten-muc-hang-hoa', name: 'Tên mục hàng hoá', icon: 'Icon' },
  ];
  constructor() {}
  ngOnInit(): void {}
}
