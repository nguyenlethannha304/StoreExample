import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './users-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { ShareModule } from '../shared/share.module';
import { PanelRowDirective } from './shared/directive/panel-row.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MyOrdersComponent } from './my-orders/my-orders.component';

@NgModule({
  declarations: [
    LogoutComponent,
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
    UserPanelComponent,
    PanelRowDirective,
    MyOrdersComponent,
  ],
  imports: [CommonModule, UserRoutingModule, ShareModule, ReactiveFormsModule],
  exports: [PanelRowDirective],
})
export class UsersModule {}
