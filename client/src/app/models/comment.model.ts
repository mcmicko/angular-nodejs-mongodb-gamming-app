export class Comment {
  public _id: number;
  public userId: number;
  public content: string;
  public gameId: number;
  public commentDate: Date;

  constructor(content: string, userId: number, gameId: number) {
    this.content = content;
    this.userId = userId;
    this.gameId = gameId;
  }
}
