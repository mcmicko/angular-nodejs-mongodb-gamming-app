import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  users$: Observable<User[]>;
  user: User;
  currentUser: User;

  error = null;
  success = false;

  selectedUser: User = new User(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );

  constructor(
    private userSevice: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.getListOfUsers();
    });
  }

  getListOfUsers() {
    this.users$ = this.userSevice.getUsers(this.currentUser._id);
  }

  onUserDelete(user: User) {
    this.selectedUser = Object.assign({}, user);
  }

  onDeleteSubmit() {
    this.userSevice.deleteUser(this.selectedUser._id).subscribe(
      () => {
        this.users$ = this.userSevice.getUsers(this.currentUser._id);
        this.selectedUser = new User(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
      },
      error => console.error(error)
    );
  }

  blockUser(form: NgForm) {
    const blockedUntil = form.value.blockedDate;

    this.userSevice.blockUser(this.selectedUser._id, blockedUntil).subscribe(
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
