import React, { useState } from "react";
import NewComment, { Comment } from "../atoms/NewComment";

interface CommentsProps {
  comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  return (
    <section>
      <div className="currentComments">
        <h3>Comments</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.user}:</strong> {comment.content}
            </li>
          ))}
        </ul>
      </div>
      <div className="comment-input">
        <NewComment />
      </div>
    </section>
  );
};

export default Comments;
