import { Component, OnInit } from '@angular/core';
import { userIcon } from 'src/app/shared/icons/icons';
import { NavigateService } from 'src/app/shared/navigate/navigate.service';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
})
export class UserPanelComponent implements OnInit {
  userIcon = userIcon;
  constructor(public navSer: NavigateService) {}

  ngOnInit(): void {}
}
