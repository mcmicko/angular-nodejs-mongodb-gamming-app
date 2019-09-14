export class User {
  public _id: number;
  public userName: string;
  public email: string;
  public role: number;
  public firstName: string;
  public lastName: string;
  public imagePath: any;
  public dateOfBirth: Date;
  public hometown: string;
  public country: string;

  constructor(
    id: number,
    userName: string,
    email: string,
    role: number,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    hometown: string,
    country: string,
    imagePath?: any
  ) {
    this._id = id;
    this.userName = userName;
    this.email = email;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imagePath = imagePath;
    this.dateOfBirth = dateOfBirth;
    this.hometown = hometown;
    this.country = country;
  }
}
