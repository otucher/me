import React, { useState, useEffect } from "react";
import Likes from "../../atoms/Likes/Likes";
import { IComment, IUser } from "../../../models";
import axiosInstance from "../../../api";
import "./style.css";

interface CommentProps {
  user?: IUser;
  comment: IComment;
  handleDeleteComment: (comment: IComment) => void;
}

const Comment: React.FC<CommentProps> = ({ user, comment, handleDeleteComment }) => {
  const [commentUser, setCommentUser] = useState<IUser>();
  useEffect(() => {
    axiosInstance.get(`/users/${comment.user_id}`).then((response) => setCommentUser(response.data));
  }, [comment]);

  const userOwnsComment = user?.id === comment.user_id;

  return (
    <div className="comment">
      {commentUser !== undefined && (
        <div>
          <strong>{commentUser.email}:</strong>
          <p>{comment.content}</p>
          {userOwnsComment && <button onClick={() => handleDeleteComment(comment)}>Delete Comment</button>}
          <Likes user={user} commentId={comment.id} />
        </div>
      )}
    </div>
  );
};

export default Comment;
