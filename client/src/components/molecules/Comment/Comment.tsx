import React, { useState, useEffect } from "react";
import Likes from "../../atoms/Likes/Likes";
import { Comment, Like } from "../../../models";
import axiosInstance from "../../../axiosInstance";
import { Optimistic, isOptimistic } from "../../../utils";
import "./style.css";

interface CommentComponentProps {
  comment: Comment;
  handleDeleteComment: (comment: Comment) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment, handleDeleteComment }) => {
  const [likes, setLikes] = useState<Optimistic<Like>[]>([])
  const getLikes = () => {
    axiosInstance.get(`/comments/${comment.id}/likes`).then((response) => setLikes(response.data));
  }
  useEffect(getLikes, [comment])

  // TODO: infer user from session
  const user = "tester"
  const handleLike = () => {
    const newLike = {
      user,
      comment_id: comment.id,
    };
    setLikes([...likes, { id: -1, isOptimistic: true,  ...newLike }]);
    axiosInstance.post("/likes", newLike).then(getLikes);
  };

  const handleRemoveLike = () => {
    axiosInstance.delete(`/comments/${comment.id}/likes/${user}`).then(getLikes)
  }

  return (
    <div className="comment">
      <strong>{comment.user}:</strong>
      <p>{comment.content}</p>
      <button onClick={() => handleDeleteComment(comment)}>Delete Comment</button>
      <div style={{ opacity: isOptimistic(likes) ? 0.5 : undefined }}>
        <Likes likes={likes} handleLike={handleLike} handleRemoveLike={handleRemoveLike} />
      </div>
    </div>
  );
};

export default CommentComponent;
