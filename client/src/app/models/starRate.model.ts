import { User } from './user.model';

export class StarRate {
  public rating: number;
  public user: number;

  constructor(user: number, rating: number) {
    this.user = user;
    this.rating = rating;
  }
}
