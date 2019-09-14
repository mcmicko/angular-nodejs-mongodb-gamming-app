import { Component, OnInit, ViewChild } from '@angular/core';
import { GamesService } from 'src/app/service/games.service';
import { Game } from 'src/app/models/game.model';
import { StarRate } from 'src/app/models/starRate.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { NgForm } from '@angular/forms';
import { Comment } from '../../models/comment.model';
import { MessageService } from 'src/app/service/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {
  searchResults: any[];
  games$: Observable<Game[]>;
  allGames: Game[] = [];
  selectedGame = new Game(null, null, null, null, null, null, null, null, null);
  selectComment: Comment = new Comment(null, null, null);

  comments$: Observable<Comment[]>;

  currentUser: User;

  error: { name: string; text: string };
  operation: string;

  @ViewChild('f', { static: false }) saveCommentForm: NgForm;
  @ViewChild('message', { static: false }) sendMessageForm: NgForm;

  constructor(
    private gameService: GamesService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.gameService.currentSearchResult.subscribe(
      searchResults => (this.searchResults = searchResults)
    );
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  // add comment
  onCommentAdd(game: Game) {
    this.operation = 'Add';
    this.saveCommentForm.reset();
    this.selectedGame = Object.assign({}, game);
    this.error = null;
  }

  onCommentSaveSubmit(form: NgForm, closeButton: HTMLButtonElement) {
    const comment = new Comment(
      form.value.content,
      this.currentUser._id,
      this.selectedGame._id
    );
    this.gameService.saveComment(comment).subscribe(
      () => {
        this.games$ = this.gameService.allGames();
        closeButton.click();
      },
      (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
      }
    );
  }

  onGetComments(game: Game) {
    this.selectedGame = Object.assign({}, game);
    this.comments$ = this.gameService.getComments(this.selectedGame._id);
  }

  onDeleteComment(comment: Comment) {
    this.selectComment = Object.assign({}, comment);
  }

  onCommentDeleteSubmit() {
    this.gameService.deleteComments(this.selectComment._id).subscribe(
      () => {
        this.comments$ = this.gameService.getComments(this.selectedGame._id);
        this.selectComment = new Comment(null, null, null);
      },

      error => console.error(error)
    );
  }

  onRateGame($event: { newValue: number }, game: Game) {
    const rating: StarRate = new StarRate(
      this.currentUser._id,
      $event.newValue
    );
    this.selectedGame = Object.assign({}, game);
    this.gameService.rateGame(this.selectedGame._id, rating).subscribe(
      () => {
        this.games$ = this.gameService.allGames();
      },
      (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
      }
    );
    console.log(` newValue: ${$event.newValue}`);
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

  getRating(game: Game) {
    for (const gameRating of game.ratings) {
      if (gameRating.user === this.currentUser._id) {
        return gameRating.rating;
      }
    }
  }

  onMessageSend(comment: Comment) {
    this.operation = 'Add';
    this.sendMessageForm.reset();
    this.selectComment = Object.assign({}, comment);
    this.error = null;
  }

  onMessageSendSubmit(form: NgForm, close: HTMLButtonElement) {
    const message = new Message(
      form.value.messageContent,
      this.currentUser._id,
      this.selectComment
    );
    this.messageService.sendMessage(message).subscribe(
      () => {
        this.games$ = this.gameService.allGames();
        close.click();
      },
      (httpErrorResponse: HttpErrorResponse) => {
        this.error = httpErrorResponse.error;
      }
    );
  }
}
