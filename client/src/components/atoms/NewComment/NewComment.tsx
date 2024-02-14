import React, { FormEvent, useState } from "react";
import "./style.css";
import { IComment, IUser } from "../../../models";
import { Without } from "../../../utils";

interface NewCommentProps {
  postId: number;
  user: IUser;
  onSubmitComment: (comment: Without<IComment>) => void;
}

const NewComment: React.FC<NewCommentProps> = ({ postId, user, onSubmitComment }) => {
  const [content, setContent] = useState("");
  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() !== "") {
      onSubmitComment({
        post_id: postId,
        user_id: user.id,
        content,
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
