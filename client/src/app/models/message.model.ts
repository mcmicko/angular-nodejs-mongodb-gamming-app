import { Comment } from '../models/comment.model';

export class Message {
  public _id: number;
  public messageContent: string;
  public messageSender: number;
  public messageReciever: number;
  public comment: Comment;

  constructor(messageContent: string, messageSender: number, comment: Comment) {
    this.messageContent = messageContent;
    this.messageSender = messageSender;
    this.comment = comment;
  }
}
