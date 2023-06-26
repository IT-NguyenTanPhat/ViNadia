export default interface IUser {
  _id: string;
  name: string;
  location?: string;
  occupation?: string;
  avatar?: string;
  viewedProfile?: number;
  impressions?: number;
  friends: [];
}

export interface IUserHeading {
  _id: string;
  name: string;
  avatar?: string;
  subtitle?: string;
}
