import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  error = null;
  success = false;
  constructor(public fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {}

  submitForm(form: NgForm) {
    const userName = form.value.userName;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    this.authService
      .register(userName, email, password, confirmPassword)
      .subscribe(
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
