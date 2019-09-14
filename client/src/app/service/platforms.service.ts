import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Platform } from '../models/platform.model';
import { Genre } from '../models/genre.model';

const headers = {
  'user-key': '58f1bec8f2a0c831cf1563b350d282b3'
};

@Injectable({
  providedIn: 'root'
})
export class PlatformsService {
  API = 'http://localhost:5000/api/platforms';

  constructor(private http: HttpClient) {}

  filterGames(platform: any, genre: any, rating: any) {
    return this.http.get(
      this.API + '/filter/' + platform + '/' + genre + '/' + rating
    );
  }

  allPlatforms(): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.API + '/platforms', { headers });
  }

  singlePlatform(id: any): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.API + id, { headers });
  }

  allGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.API + '/genres', { headers });
  }
}
