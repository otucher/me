import React, { useState, useEffect } from "react";
import NewComment from "../atoms/NewComment";
import CommentComponent, { Comment } from "../atoms/Comment";

interface OptimisticComment extends Comment {
  isOptimistic?: boolean;
}

interface CommentsProps {
  comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  const [optimisticComments, setOptimisticComments] =
    useState<OptimisticComment[]>(comments);

  const handleNewComment = (newComment: Comment) => {
    // TODO: submit comment to server
    setOptimisticComments([...comments, { ...newComment, isOptimistic: true }]);
  };

  // any time the comments prop changes, update the optimisticComments state so that no comments are optimistic
  useEffect(() => {
    setOptimisticComments(comments);
  }, [comments]);

  return (
    <div>
      <NewComment onSubmitComment={handleNewComment} />
      <div className="comments">
        <h3>Comments</h3>
        <ul>
          {optimisticComments.map((optimisticComment, idx) => (
            <li key={idx}>
              <CommentComponent {...optimisticComment} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Comments;
