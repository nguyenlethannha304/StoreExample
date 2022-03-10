import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth/auth.guard';
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
    canActivate: [AuthGuard],
  },
  {
    path: 'doi-mat-khau',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: UserPanelComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
