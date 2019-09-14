import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { GamesService } from '../../service/games.service';
import { Game } from 'src/app/models/game.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  opened = true;

  users$: Observable<User[]>;
  user: User;
  currentUser: User;
  selectedUser: User = new User(
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
  games$: Observable<Game[]>;
  userGames: Game[] = [];

  constructor(
    private userSevice: UserService,
    private authService: AuthService,
    private gameService: GamesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.getListOfUsers();
    });
  }

  getListOfUsers() {
    this.users$ = this.userSevice.getUsers(this.currentUser._id);
  }
}
