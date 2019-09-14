import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = null;
  success = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogin(form: NgForm) {
    const userName = form.value.userName;
    const password = form.value.password;

    this.authService.login(userName, password).subscribe(
      res => {
        this.error = null;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
      }
    );
  }

  onResetPasswordRequest(form: NgForm) {
    const userEmail = form.value.email;

    this.authService.resetPasswordRequest(userEmail).subscribe(
      () => {
        this.error = null;
        this.success = true;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
        this.success = false;
      }
    );
  }
}
