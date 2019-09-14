import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, from } from 'rxjs';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { GamesService } from '../../service/games.service';
import { Game } from '../../models/game.model';
import { UserService } from '../../service/user.service';
import { Comment } from '../../models/comment.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { StarRate } from 'src/app/models/starRate.model';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-another-user-profile',
  templateUrl: './another-user-profile.component.html',
  styleUrls: ['./another-user-profile.component.scss']
})
export class AnotherUserProfileComponent implements OnInit {
  users$: Observable<User[]>;
  games$: Observable<Game[]>;
  allGames: Game[] = [];
  comments$: Observable<Comment[]>;

  operation: string;
  @ViewChild('s', { static: false }) CommentForm: NgForm;
  @ViewChild('message', { static: false }) sendMessageForm: NgForm;

  currentGame: Game;
  currentUser: User;

  selectedGame = new Game(null, null, null, null, null, null, null, null, null);
  selectComment: Comment = new Comment(null, null, null);
  error: { name: string; text: string };

  selUser: User = {
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

  public isClicked = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private gameService: GamesService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.games$ = this.gameService.getMyGames(params.userId);

      this.userService.getSelectedUser(params.userId).subscribe(user => {
        this.selUser = user;
      });
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  // add comment
  CommentAdd(game: Game) {
    this.operation = 'Add';
    this.CommentForm.reset();
    this.selectedGame = Object.assign({}, game);
    this.error = null;
  }

  CommentSaveSubmit(form: NgForm, closeButton: HTMLButtonElement) {
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

  GetComments(game: Game) {
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
