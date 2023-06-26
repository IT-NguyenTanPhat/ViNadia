import IUser from './User';

export default interface IPost {
  _id: string;
  user: IUser;
  description?: string;
  image?: string;
  comments: [];
  likes: string[];
}
