import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  API = 'http://localhost:5000/api/messages';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  sendMessage(message: Message): Observable<any> {
    return this.httpClient.post(this.API + '/', message, {
      headers: this.authService.getAuthHeaders()
    });
  }

  receiveMessage(): Observable<any> {
    return this.httpClient.get<Message[]>(this.API + '/', {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteMessage(messageId: number) {
    return this.httpClient.delete(this.API + '/delete/' + messageId, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
