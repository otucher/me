import React, { useEffect, useState } from "react";
import { Post, Like } from "../../../models";
import Comments from "../../organisms/Comments/Comments";
import Likes from "../../atoms/Likes/Likes";
import axiosInstance from "../../../axiosInstance"
import { Optimistic, isOptimistic } from "../../../utils";
import "./style.css";

const PostComponent: React.FC<Post> = (post) => {
  const [likes, setLikes] = useState<Optimistic<Like>[]>([])
  const getLikes = () => {
    axiosInstance.get(`/posts/${post.id}/likes`).then((response) => setLikes(response.data));
  }
  useEffect(getLikes, [post])

  // TODO: infer user from session
  const user = "tester"
  const handleLike = () => {
    const newLike = {
      user,
      post_id: post.id,
    };
    setLikes([...likes, { id: -1, isOptimistic: true,  ...newLike }]);
    axiosInstance.post("/likes", newLike).then(getLikes);
  };

  const handleRemoveLike = () => {
    axiosInstance.delete(`/posts/${post.id}/likes/${user}`).then(getLikes)
  }

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-meta">
        <p>Author: {post.user}</p>
        <Likes likes={likes} handleLike={handleLike} handleRemoveLike={handleRemoveLike} />
        <Comments postId={post.id} />
      </div>
    </div>
  );
};

export default PostComponent;
