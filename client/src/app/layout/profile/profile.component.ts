import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { GamesService } from 'src/app/service/games.service';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  games$: Observable<Game[]>;
  userGames: Game[] = [];
  fileData: File = null;
  userGames$: Observable<Game[]>;

  user: User;
  currentDate = new Date();
  selectedUser: User = {
    _id: null,
    firstName: null,
    lastName: null,
    imagePath: null,
    dateOfBirth: null,
    hometown: null,
    country: null,
    userName: null,
    email: null,
    role: null
  };
  error = null;
  success = false;

  operation: string;
  selectedGame: Game = new Game(
    null,
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

  searchedGame: Game;

  constructor(
    private authService: AuthService,
    private gameService: GamesService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.selectedUser = user;
      this.userGames$ = this.gameService.getMyGames(this.selectedUser._id);
    });
  }

  addInfo(user: User) {
    this.selectedUser = JSON.parse(JSON.stringify(user));
    this.error = null;
  }

  onImagePicked(event: any) {
    this.fileData = <File>(event.target as HTMLInputElement).files[0];
    console.log(this.fileData);
  }

  updateProfile(form: NgForm, closeButton: HTMLButtonElement) {
    const userId = this.selectedUser._id;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const imagePath = this.fileData;
    const dateOfBirth = form.value.dateOfBirth;
    const hometown = form.value.hometown;
    const country = form.value.country;

    this.authService
      .updateUserProfile(
        userId,
        firstName,
        lastName,
        imagePath,
        dateOfBirth,
        hometown,
        country
      )
      .subscribe(
        () => {
          this.error = null;
          this.success = true;
          closeButton.click();
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.error = httpErrorResponse.error;
          this.success = false;
        }
      );
  }
  // search
  onSearchTitle(form: NgForm) {
    const name = form.value;
    this.games$ = this.gameService.searchGames(name);
  }

  // delete game
  onGameDelete(game: Game) {
    this.selectedGame = Object.assign({}, game);
  }

  onGameDeleteSubmit() {
    this.gameService.deleteGame(this.selectedGame._id).subscribe(
      () => {
        this.authService.getCurrentUser().subscribe(user => {
          this.userGames$ = this.gameService.getMyGames(user._id);
        });
        this.selectedGame = new Game(
          null,
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

  // SCHEDULE GAME
  onScheduleGame(game: Game) {
    this.operation = 'Schedule';
    this.selectedGame = Object.assign({}, game);
  }
  onScheduleGameSubmit(form: NgForm) {
    const scheduleUntil = form.value.scheduleDate;
    const nameGame = this.selectedGame.name;

    this.gameService
      .scheduleGame(
        this.selectedGame._id,
        this.selectedUser._id,
        scheduleUntil,
        nameGame
      )
      .subscribe(
        () => {
          this.error = null;
          this.success = true;
          this.userGames$ = this.gameService.getMyGames(this.selectedUser._id);
        },
        (HttpErrorResponse: HttpErrorResponse) => {
          this.error = HttpErrorResponse.error;
          this.success = false;
        }
      );
  }

  avgRating(game: Game) {
    let sum = 0;
    if (game.ratings.length !== 0) {
      for (const item of game.ratings) {
        sum += item.rating;
      }
      const avg = sum / game.ratings.length;
      return avg;
    } else {
      return 0;
    }
  }
}
