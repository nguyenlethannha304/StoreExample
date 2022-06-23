import { HttpClient } from '@angular/common/http';
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
import { Email } from '../shared/interface/users';
import { environment as e } from 'src/environments/environment';
import { renderIconToView } from 'src/app/shared/services/icons/icon-functions';
@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
})
export class UserPanelComponent implements OnInit, AfterViewInit {
  userIcon = userIcon;
  userEmail: Email;
  @ViewChild('avatarIcon') avatarIconContainer: ElementRef;
  constructor(
    public navSer: NavigateService,
    private render: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http
      .get<string>(`${e.api}/users/get_email_address/`, {
        headers: { Authorization: 'yes' },
      })
      .subscribe((email) => (this.userEmail = email));
  }
  ngAfterViewInit(): void {
    renderIconToView(this.render, {
      icon: userIcon,
      iconContainer: this.avatarIconContainer,
    });
  }
}
