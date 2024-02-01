import React, { useState, useEffect } from "react";
import { Comment } from "../../../models";
import axiosInstance from "../../../axiosInstance";
import NewComment from "../../atoms/NewComment/NewComment";
import CommentComponent from "../../molecules/Comment/Comment";
import { Optimistic, isOptimistic } from "../../../utils";
import "./style.css";

interface CommentsProps {
  postId: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Optimistic<Comment>[]>([]);
  const getComments = () => {
    axiosInstance.get(`/posts/${postId}/comments`).then((response) => setComments(response.data));
  }
  useEffect(getComments, [postId]);

  const handleNewComment = (comment: Comment) => {
    setComments([...comments, { isOptimistic: true, ...comment }]);
    axiosInstance.post("/comments", comment).then(getComments);
  };

  const handleDeleteComment = (deletedComment: Comment) => {
    var newComments = comments.filter((com) => com !== deletedComment)
    setComments([...newComments, { isOptimistic: true, ...deletedComment }]);
    axiosInstance.delete(`/comments/${deletedComment.id}`).then(getComments)
  }

  return (
    <div className="comments">
      <h3>Comments</h3>
      <NewComment user={"TestUser"} postId={postId} onSubmitComment={handleNewComment} />
      <ul>
        {comments.map((comment, idx) => (
          <li key={idx}>
            <div className="comments" style={{ opacity: isOptimistic(comments) ? 0.5 : undefined }}>
              <CommentComponent
                comment={comment}
                handleDeleteComment={handleDeleteComment}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
