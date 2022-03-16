import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { userIcon } from 'src/app/shared/services/icons/icons';
import { NavigateService } from 'src/app/shared/services/navigate/navigate.service';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
})
export class UserPanelComponent implements OnInit, AfterViewInit {
  userIcon = userIcon;
  @ViewChild('avatarIcon') avatarIconContainer: ElementRef;
  constructor(public navSer: NavigateService, private render: Renderer2) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.render.setProperty(
      this.avatarIconContainer.nativeElement,
      'innerHTML',
      userIcon
    );
  }
}
