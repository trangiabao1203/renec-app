export interface Profile {
  _id: string;
  email: string;
  fullName: string;
}

export interface TokenProfile {
  accessToken: string;
  profile: Profile;
}
