import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './users-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { SafeIconHTMLPipe } from '../shared/pipe/safe-html.pipe';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    ProfileComponent,
    RegisterComponent,
    ChangePasswordComponent,
    UserPanelComponent,
  ],
  imports: [CommonModule, UserRoutingModule],
})
export class UsersModule {}
