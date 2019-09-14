import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';

import { Game } from '../../../models/game.model';
import { User } from '../../../models/user.model';
import { Platform } from '../../../models/platform.model';
import { Genre } from '../../../models/genre.model';
import { Rating } from '../../../models/rating.model';

import { GamesService } from '../../../service/games.service';
import { PlatformsService } from '../../../service/platforms.service';
import { AuthService } from '../../../service/auth.service';

const platforms = [
  { id: null, name: 'platform / none' },
  { id: 6, name: 'PC (Microsoft Windows)' },
  { id: 14, name: 'Mac' },
  { id: 8, name: 'PlayStation 2' },
  { id: 9, name: 'PlayStation 3' },
  { id: 48, name: 'PlayStation 4' },
  { id: 12, name: 'Xbox 360' },
  { id: 49, name: 'Xbox One' }
];
const rating = [
  { id: null, name: 'rating / none' },
  { id: 50, name: 'greater than 50' },
  { id: 60, name: 'greater than 60' },
  { id: 75, name: 'greater than 75' },
  { id: 90, name: 'greater than 90' }
];
const genres = [
  { id: null, name: 'genre / none' },
  { id: 15, name: 'Strategy' },
  { id: 14, name: 'Sport' },
  { id: 10, name: 'Racing' },
  { id: 31, name: 'Adventure' },
  { id: 5, name: 'Shooter' },
  { id: 26, name: 'Quiz/Trivia' },
  { id: 7, name: 'Music' },
  { id: 13, name: 'Simulator' }
];

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  games$: Observable<Game[]>;
  platforms$: any;
  ratings$: any;
  genres$: any;
  error: { title: string; storyline: string };
  operation: string;
  selectGame: Game = new Game(
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
  selectUser: User;
  selectPlatform: Platform = new Platform(null, null);
  selectGenre: Genre = new Genre(null, null);
  selectRating: Rating = new Rating(null, null);
  err = null;
  saved = false;
  displayedColumns = ['cover', 'name', 'rating', 'platforms', 'genres'];
  dataSource;
  isLoading = false;

  constructor(
    private gamesServices: GamesService,
    private platformsService: PlatformsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.selectPlatform = platforms[0];
    this.selectGenre = genres[0];
    this.selectRating = rating[0];

    this.platforms$ = platforms;
    this.ratings$ = rating;
    this.genres$ = genres;

    this.gamesServices.allGamesIgdb().subscribe(results => {
      this.isLoading = true;
      this.dataSource = new MatTableDataSource(results);
      this.dataSource.sort = this.sort;
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.selectUser = user;
    });
  }

  // filter Game
  filterGame() {
    const platform: any = this.selectPlatform.id;
    const genre: any = this.selectGenre.id;
    const rating: any =
      this.selectRating.id === null ? '' : this.selectRating.id;
    this.platformsService
      .filterGames(platform, genre, rating)
      .subscribe((results: { platform: any; genre: any; rating: any }[]) => {
        this.dataSource = new MatTableDataSource(results as {
          platform: any;
          genre: any;
          rating: any;
        }[]);
        this.dataSource.sort = this.sort;
      });
  }

  // search
  onSearchTitle(form: NgForm) {
    const name = form.value;
    this.gamesServices.searchGames(name).subscribe(results => {
      this.dataSource = new MatTableDataSource(results);
      this.dataSource.sort = this.sort;
    });
  }

  // save to your db
  onSaveGame(game: Game) {
    this.operation = 'Save';
    this.selectGame = Object.assign({}, game);
  }
  onSaveGameSubmit() {
    const game: Game = new Game(
      (this.selectGame.user = this.selectUser._id),
      this.selectGame.name,
      this.selectGame.storyline,
      this.selectGame.rating,
      this.selectGame.cover,
      this.selectGame.platforms,
      this.selectGame.genres,
      this.selectGame.first_release_date,
      this.selectGame.url
    );

    this.gamesServices.saveGames(game).subscribe(
      () => {
        this.err = null;
        this.saved = true;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
      }
    );
  }
}
