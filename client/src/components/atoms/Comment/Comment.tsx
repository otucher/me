import React from "react";
import Likes from "../../molecules/Likes/Likes";
import { Comment } from "../../../models";
import "./style.css";

interface CommentComponentProps {
  comment: Comment;
  handleDeleteComment: (comment: Comment) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment, handleDeleteComment }) => {
  return (
    <div className="comment">
      <strong>{comment.user}:</strong>
      <p>{comment.content}</p>
      <button onClick={() => handleDeleteComment(comment)}>Delete Comment</button>
      <Likes commentId={comment.id} />
    </div>
  );
};

export default CommentComponent;
