import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/models/user.model';
import { GamesService } from 'src/app/service/games.service';
import { Comment } from 'src/app/models/comment.model';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  messages$: Observable<Message[]>;
  currentUser: User;
  selectComment: Comment = new Comment(null, null, null);
  selectedMessage: Message = new Message(null, null, null);

  comment: Comment;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private gameService: GamesService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.messages$ = this.messageService.receiveMessage();
  }

  onDeleteComment(message: Message) {
    this.selectedMessage = Object.assign({}, message);
  }

  onCommentDeleteSubmit() {
    this.gameService.deleteComments(this.selectedMessage.comment._id).subscribe(
      () => {
        this.onMessageDeleteSubmit();
        this.messages$ = this.messageService.receiveMessage();
      },

      error => console.error(error)
    );
  }

  onMessageDelete(message: Message) {
    this.selectedMessage = Object.assign({}, message);
  }

  onMessageDeleteSubmit() {
    this.messageService.deleteMessage(this.selectedMessage._id).subscribe(
      () => {
        this.messages$ = this.messageService.receiveMessage();
        this.selectedMessage = new Message(null, null, null);
      },
      error => console.error(error)
    );
  }
}
