export default interface User {
  _id: string;
  name: string;
  location?: string;
  occupation?: string;
  avatar?: string;
  viewedProfile?: number;
  impressions?: number;
  friends: [];
}
