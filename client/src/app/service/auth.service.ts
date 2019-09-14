import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API = 'http://localhost:5000/api/users';
  private authenticated = false;
  private headers: HttpHeaders;
  public user: User;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getProfiles(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API, {
      headers: this.getAuthHeaders()
    });
  }

  saveProfile(user: User): Observable<any> {
    return this.httpClient.post(this.API, user, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserProfile(
    userId: any,
    firstName: string,
    lastName: string,
    image: any,
    dateOfBirth: any,
    hometown: string,
    country: string
  ) {
    const fd = new FormData();
    fd.append('image', image);
    fd.append('userId', userId);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('dateOfBirth', dateOfBirth);
    fd.append('hometown', hometown);
    fd.append('country', country);
    return this.httpClient.post<any>(
      this.API + '/updateProfile/', fd,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  register(
    userName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    return this.httpClient.post<any>(this.API + '/register', {
      userName,
      email,
      password,
      confirmPassword
    });
  }

  login(userName: string, password: string) {
    return this.httpClient
      .post<any>(this.API + '/login', { userName, password })
      .pipe(
        tap(resData => {
          localStorage.setItem('token', resData.token);
          this.setAuthHeaders(resData.token);
          this.getCurrentUser().subscribe(user => {
            this.user = user;
            this.authenticated = true;
            this.router.navigate(['/profile']);
          });
        })
      );
  }

  getCurrentUser() {
    return this.httpClient.get<User>(this.API + '/current', {
      headers: this.headers
    });
  }

  getUserName() {
    if (this.user) {
      return this.user.userName;
    }
  }

  isAuthenticated() {
    return this.authenticated;
  }

  hasRoleAdmin() {
    if (this.user) {
      return this.user.role === 4;
    }
  }

  getAuthHeaders() {
    return this.headers;
  }

  setAuthHeaders(token: string) {
    this.headers = new HttpHeaders({
      Authorization: token
    });
  }

  logout() {
    this.authenticated = false;
    this.user = null;
    this.headers = null;
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  autoLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    this.setAuthHeaders(token);
    this.getCurrentUser().subscribe(user => {
      this.user = user;
      this.authenticated = true;
    });
  }

  resetPasswordRequest(userEmail: string) {
    return this.httpClient.post<any>(this.API + '/requestPasswordReset', {
      userEmail
    });
  }

  changePassword(userName: string, password: string, confirmPassword: string) {
    return this.httpClient.post<any>(this.API + '/changePassword', {
      userName,
      password,
      confirmPassword
    });
  }
}
