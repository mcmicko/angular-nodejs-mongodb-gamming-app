import { StarRate } from './starRate.model';

export class Game {
  public _id: number;
  public user: number;
  public name: string;
  public storyline: string;
  public rating: number;
  public cover: {};
  public genres: [];
  public platforms: [];
  public first_release_date: Date;
  public url: string;
  public scheduleDate: Date;
  public ratings: StarRate[];

  constructor(
    user: number,
    name: string,
    storyline: string,
    rating: number,
    cover: {},
    platforms: [],
    genres: [],
    first_realease_date: Date,
    url: string,
    scheduleDate?: Date,
    id?: number
  ) {
    this._id = id;
    this.user = user;
    this.name = name;
    this.storyline = storyline;
    this.rating = rating;
    this.cover = cover;
    this.genres = genres;
    this.platforms = platforms;
    this.first_release_date = first_realease_date;
    this.url = url;
    this.scheduleDate = scheduleDate;
  }
}
