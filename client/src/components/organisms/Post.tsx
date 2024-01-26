import React from "react";
import { Comment } from "../atoms/Comment";
import Comments from "../molecules/Comments";
import Likes, { Like } from "../atoms/Likes";

export interface PostProps {
  title: string;
  content: string;
  user: string;
  timestamp: Date;
  likes: Like[];
  comments: Comment[];
}

const Post: React.FC<PostProps> = (props) => {
  return (
    <div className="post">
      <h3>{props.title}</h3>
      <p>{props.content}</p>
      <div className="post-meta">
        <p>Author: {props.user}</p>
        <Likes likes={props.likes} />
        <Comments comments={props.comments} />
      </div>
    </div>
  );
};

export default Post;
