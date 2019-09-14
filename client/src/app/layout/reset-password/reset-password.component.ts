import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  error = null;
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onChangePassword(form: NgForm) {
    const userName = form.value.userName;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    this.authService
      .changePassword(userName, password, confirmPassword)
      .subscribe(
        res => {
          this.error = null;
          this.router.navigateByUrl('/search-list');
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.error = httpErrorResponse.error;
        }
      );
  }
}
