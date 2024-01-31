import React, { FormEvent, useState } from "react";
import "./style.css";
import { Comment } from "../../../models";

interface NewCommentProps {
  postId: number;
  user: string;
  onSubmitComment: (comment: Comment) => void;
}

const NewComment: React.FC<NewCommentProps> = ({ postId, user, onSubmitComment }) => {
  const [content, setContent] = useState("");
  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() !== "") {
      onSubmitComment({
        id: -1,
        post_id: postId,
        content,
        user,
      });
      // reset the form state
      setContent("");
    }
  };
  return (
    <form onSubmit={handleCommentSubmit}>
      <label>Content:</label>
      <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default NewComment;
