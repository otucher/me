export interface IPost {
  id: number;
  created_at: string;
  title: string;
  content: string;
  user_id: number;
}

export interface IComment {
  id: number;
  created_at: string;
  user_id: number;
  content: string;
  post_id: number;
}

export interface ILike {
  id: number;
  created_at: string;
  user_id: number;
  comment_id?: number;
  post_id?: number;
}

export interface IUser {
  id: number;
  created_at: string;
  email: string;
}
