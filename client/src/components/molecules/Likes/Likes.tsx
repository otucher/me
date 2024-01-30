import React, { useState, useEffect } from "react";
import { Like } from "../../../models";
import axiosInstance from "../../../axiosInstance";
import "./style.css";

interface LikesProps {
  commentId?: number;
  postId?: number;
}

const Likes: React.FC<LikesProps> = ({ commentId, postId }) => {
  const [currentLikes, setCurrentLikes] = useState<Like[]>([]);
  const [optimisticLikes, setOptimisticLikes] = useState(currentLikes);

  useEffect(() => {
    if (postId && commentId) {
      throw new Error("Cannot have both postId and commentId");
    } else if (postId) {
      axiosInstance.get(`/posts/${postId}/likes`).then((response) => setCurrentLikes(response.data));
    } else if (commentId) {
      axiosInstance.get(`/comments/${commentId}/likes`).then((response) => setCurrentLikes(response.data));
    }
  }, [commentId, postId]);

  // TODO: infer user from session
  const user = "Tester";

  const handleLike = () => {
    const newLike = {
      user,
      comment_id: commentId,
      post_id: postId,
    };
    setOptimisticLikes([...currentLikes, { id: -1, ...newLike }]);
    axiosInstance.post("/likes", newLike).then((response) => setCurrentLikes([...currentLikes, response.data]));
  };

  const handleRemoveLike = () => {
    const newLikes = currentLikes.filter((like) => like.user !== user)
    setOptimisticLikes(newLikes);
    if (postId && commentId) {
      throw new Error("Cannot have both postId and commentId");
    } else if (postId) {
      axiosInstance.delete(`/posts/${postId}/likes/${user}`)
        .then(() => setCurrentLikes(newLikes));
    } else if (commentId) {
      axiosInstance.delete(`/comments/${commentId}/likes/${user}`)
        .then(() => setCurrentLikes(newLikes));
    }
  }

  // replace optimistic likes with real likes after server responds
  useEffect(() => setOptimisticLikes(currentLikes), [currentLikes]);

  const numLikes = optimisticLikes.length;
  const isOptimistic = currentLikes !== optimisticLikes;
  return (
    <div className="likes">
      <button onClick={handleLike}>Like</button>
      <button onClick={handleRemoveLike}>Remove Like</button>
      <p style={{ opacity: isOptimistic ? 0.5 : undefined }}>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </p>
    </div>
  );
};

export default Likes;
