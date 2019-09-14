import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API = 'http://localhost:5000/api';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  // Return Observable that wraps array of users
  getUsers(userId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API + '/users/userList/' + userId, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getSelectedUser(userId: number): Observable<User> {
    return this.httpClient.get<User>(this.API + '/users/' + userId, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteUser(userId) {
    return this.httpClient.delete(this.API + '/users/' + userId, {
      headers: this.authService.getAuthHeaders()
    });
  }

  blockUser(userId: number, blockDate: Date) {
    return this.httpClient.post(
      this.API + '/users/block/' + userId,
      { blockDate },
      {
        headers: this.authService.getAuthHeaders()
      }
    );
  }
}
