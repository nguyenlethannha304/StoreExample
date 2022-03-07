import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './users-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { ShareModule } from '../shared/share.module';
import { PanelRowDirective } from './shared/directive/panel-row.directive';

@NgModule({
  declarations: [
    LogoutComponent,
    ProfileComponent,
    RegisterComponent,
    ChangePasswordComponent,
    UserPanelComponent,
    PanelRowDirective,
  ],
  imports: [CommonModule, UserRoutingModule, ShareModule],
  exports: [
    PanelRowDirective
  ],
})
export class UsersModule {}
