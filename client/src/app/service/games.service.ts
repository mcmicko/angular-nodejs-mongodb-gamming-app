import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Game } from '../models/game.model';
import { AuthService } from '../service/auth.service';
import { Comment } from '../models/comment.model';
import { StarRate } from '../models/starRate.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  API = 'http://localhost:5000/api';

  private searchResult: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentSearchResult = this.searchResult.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  allGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.API + '/gamesMongoDB/games/', {
      headers: this.authService.getAuthHeaders()
    });
  }

  allGamesIgdb(): Observable<Game[]> {
    return this.http.get<Game[]>(this.API + '/games/', {
      headers: this.authService.getAuthHeaders()
    });
  }

  searchGames(name: any): Observable<any> {
    return this.http.get(this.API + '/games/search/' + name, {
      headers: { 'user-key': '58f1bec8f2a0c831cf1563b350d282b3' }
    });
  }
  getMyGames(id: number): Observable<Game[]> {
    return this.http.get<Game[]>(this.API + '/gamesMongoDB/user/' + id, {
      headers: this.authService.getAuthHeaders()
    });
  }
  saveGames(game: Game): Observable<any> {
    return this.http.post(this.API + '/gamesMongoDB/', game, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // saveCommets
  saveComment(comment: Comment): Observable<any> {
    return this.http.post(this.API + '/comments/', comment, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // get comments
  getComments(gameId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.API + '/comments/game/' + gameId, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // delete comments
  deleteComments(id: number) {
    return this.http.delete(this.API + '/comments/' + id, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // search story
  searchGame(gameName: string): Observable<any> {
    return this.http.get(this.API + '/gamesMongoDB/search/' + gameName, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // changing message on the other component
  changeMessage(message: any) {
    this.searchResult.next(message);
  }
  // delete game
  deleteGame(gameId: number) {
    return this.http.delete(this.API + '/gamesMongoDB/' + gameId, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // SCHEDULE GAME
  scheduleGame(
    gameId: number,
    userId: number,
    scheduleDate: any,
    nameGame: string
  ) {
    return this.http.post(
      this.API + '/gamesMongoDB/schedule/' + gameId + '/' + userId,
      { scheduleDate, nameGame },
      {
        headers: this.authService.getAuthHeaders()
      }
    );
  }

  // rate story
  rateGame(gameId: number, rating: StarRate): Observable<any> {
    return this.http.post(this.API + '/gamesMongoDB/rate/' + gameId, rating, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
