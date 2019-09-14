import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './layout/register/register.component';
import { LoginComponent } from './layout/login/login.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { GamesListComponent } from './components/games/games-list/games-list.component';
import { HomeComponent } from './layout/home/home.component';
import { AnotherUserProfileComponent } from './layout/another-user-profile/another-user-profile.component';
import { AdminpanelComponent } from './layout/adminpanel/adminpanel.component';
import { AuthGuard } from './auth.guard';
import { SearchListComponent } from './components/search-list/search-list.component';
import { ResetPasswordComponent } from './layout/reset-password/reset-password.component';
import { InboxComponent } from './components/inbox/inbox.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  {
    path: 'games-list',
    component: GamesListComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  {
    path: 'anotherUserProfile/:userId',
    component: AnotherUserProfileComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  {
    path: 'adminpanel',
    component: AdminpanelComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'search-list',
    component: SearchListComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  {
    path: 'inbox',
    component: InboxComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
