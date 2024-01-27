import React from "react";
import { Post } from "../../models";
import Comments from "../molecules/Comments";
import Likes from "../molecules/Likes";

const PostComponent: React.FC<Post> = (post) => {
  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-meta">
        <p>Author: {post.user}</p>
        <Likes postId={post.id} />
        <Comments postId={post.id} />
      </div>
    </div>
  );
};

export default PostComponent;
