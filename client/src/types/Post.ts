import IUser from './User';

export default interface IPost {
  _id: string;
  author: IUser;
  description?: string;
  image?: string;
  comments: [];
  likes: string[];
}
