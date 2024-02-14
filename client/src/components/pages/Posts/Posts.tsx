import React from "react";
import { IPost } from "../../../models";
import { Link } from "react-router-dom";
import "./style.css";

interface PostsProps {
  posts: IPost[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
  return (
    <div className="posts">
      {posts.map((post, idx) => (
        <Link key={idx} to={`/posts/${post.id}`}>
          <div className="post-card">
            <p>{post.title}</p>
            <p>{post.content.slice(0, 128)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
