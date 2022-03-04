import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { resizeIcon } from 'src/app/shared/icons/icon-functions';
import { userIcon } from 'src/app/shared/icons/icons';
import { NavigateService } from 'src/app/shared/navigate/navigate.service';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
})
export class UserPanelComponent implements OnInit, AfterViewInit {
  userIcon = userIcon;
  @ViewChild('avatarIcon') avatarIconRef!: ElementRef;
  constructor(public navSer: NavigateService) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    resizeIcon(this.avatarIconRef, '1.5rem');
  }
}
