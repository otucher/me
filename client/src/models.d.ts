export interface Post {
  id: number;
  title: string;
  content: string;
  user: string;
  timestamp?: string;
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  timestamp?: string;
  post_id: number;
}

export interface Like {
  id: number;
  user: string;
  timestamp?: string;
  comment_id?: number;
  post_id?: number;
}
