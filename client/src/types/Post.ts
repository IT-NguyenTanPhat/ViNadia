import User from './User';

export default interface Post {
  _id: string;
  user: User;
  description?: string;
  image?: string;
  comments: [];
}
