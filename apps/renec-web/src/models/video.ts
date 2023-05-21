import { Profile } from "./profile";

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  author?: Profile;
  likeByIds: string[];
  dislikeByIds: string[];
}

export interface VideoList {
  items: Video[];
  total: number;
}