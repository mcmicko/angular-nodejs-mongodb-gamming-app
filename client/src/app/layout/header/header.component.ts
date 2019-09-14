import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NgForm } from '@angular/forms';
import { GamesService } from 'src/app/service/games.service';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/service/message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public errorObject = null;
  searchResults: any[];
  @ViewChild('gameName', { static: false }) onSearchNameForm: NgForm;
  messages$: Observable<Message[]>;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private gameService: GamesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameService.currentSearchResult.subscribe(
      searchResults => (this.searchResults = searchResults)
    );
    this.messages$ = this.messageService.receiveMessage();
  }

  onSearchGameName(form: NgForm) {
    this.errorObject = null;
    const name = form.value.name;
    this.gameService.searchGame(name).subscribe(data => {
      this.searchResults = data;
      this.sendSearchResult();
    });
    this.onSearchNameForm.reset();
  }

  sendSearchResult() {
    this.gameService.changeMessage(this.searchResults);
    this.router.navigateByUrl('/search-list');
  }
}
