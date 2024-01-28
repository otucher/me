import React from "react";
import { Post } from "../../../models";
import { Link } from "react-router-dom";
import "./style.css";

interface PostsProps {
  posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
  return (
    <div className="posts">
      {posts.map((post) => (
        <Link to={`/posts/${post.id}`}>
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
