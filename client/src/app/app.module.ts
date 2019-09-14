import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { MatSortModule } from '@angular/material';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layout/header/header.component';
import { RegisterComponent } from './layout/register/register.component';
import { LoginComponent } from './layout/login/login.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { GamesListComponent } from './components/games/games-list/games-list.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HomeComponent } from './layout/home/home.component';
import { AnotherUserProfileComponent } from './layout/another-user-profile/another-user-profile.component';
import { AdminpanelComponent } from './layout/adminpanel/adminpanel.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { ResetPasswordComponent } from './layout/reset-password/reset-password.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { RatingModule } from 'ng-starrating';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    GamesListComponent,
    SidenavComponent,
    HomeComponent,
    AnotherUserProfileComponent,
    AdminpanelComponent,
    SearchListComponent,
    ResetPasswordComponent,
    InboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatSortModule,
    JwSocialButtonsModule,
    RatingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
