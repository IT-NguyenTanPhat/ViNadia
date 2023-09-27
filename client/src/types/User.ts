export default interface IUser {
  _id: string;
  name: string;
  location?: string;
  occupation?: string;
  avatar?: string;
}

export interface IUserHeader {
  _id: string;
  name: string;
  avatar?: string;
  location?: string;
}
