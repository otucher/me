import React, { useState, useEffect } from "react";
import { IComment, IUser } from "../../../models";
import axiosInstance from "../../../api";
import NewComment from "../../atoms/NewComment/NewComment";
import Comment from "../../molecules/Comment/Comment";
import { Without, Optimistic, isOptimistic } from "../../../utils";
import "./style.css";

interface CommentsProps {
  user?: IUser;
  postId: number;
}

const Comments: React.FC<CommentsProps> = ({ user, postId }) => {
  const [comments, setComments] = useState<Optimistic<IComment>[]>([]);
  const getComments = () => {
    axiosInstance.get(`/posts/${postId}/comments`).then((response) => setComments(response.data));
  };
  useEffect(getComments, [postId]);

  const handleNewComment = (comment: Without<IComment>) => {
    const newOptimisticComment = {
      ...comment,
      id: -1,
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };
    setComments([...comments, newOptimisticComment]);
    axiosInstance.post("/comments", comment).then(getComments);
  };

  const handleDeleteComment = (deletedComment: IComment) => {
    var newComments = comments.filter((com) => com !== deletedComment);
    setComments([...newComments, { isOptimistic: true, ...deletedComment }]);
    axiosInstance.delete(`/comments/${deletedComment.id}`).then(getComments);
  };

  return (
    <div className="comments">
      <h3>Comments</h3>
      {user ? <NewComment user={user} postId={postId} onSubmitComment={handleNewComment} /> : <p>Log in to comment</p>}
      <ul>
        {comments.map((comment, idx) => (
          <li key={idx}>
            <div className="comments" style={{ opacity: isOptimistic(comments) ? 0.5 : undefined }}>
              <Comment user={user} comment={comment} handleDeleteComment={handleDeleteComment} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
