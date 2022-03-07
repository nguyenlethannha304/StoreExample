import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { UserPanelComponent } from './user-panel/user-panel.component';

const routes: Routes = [
  {
    path: 'dang-nhap',
    component: LoginComponent,
  },
  {
    path: 'dang-xuat',
    component: LogoutComponent,
  },
  {
    path: 'dang-ky',
    component: RegisterComponent,
  },
  {
    path: 'thong-tin-tai-khoan',
    component: ProfileComponent,
  },
  {
    path: 'doi-mat-khau',
    component: ChangePasswordComponent,
  },
  {
    path: '',
    component: UserPanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
