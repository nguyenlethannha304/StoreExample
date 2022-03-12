import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { renderIconToView } from 'src/app/shared/services/icons/icon-functions';
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
    renderIconToView(
      userIcon,
      this.avatarIconContainer.nativeElement,
      this.render
    );
  }
}
