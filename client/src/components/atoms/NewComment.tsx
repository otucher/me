import React, { useState } from "react";
import { Comment } from "./Comment";

interface NewCommentProps {
  onSubmitComment: (comment: Comment) => void;
}

const NewComment: React.FC<NewCommentProps> = ({ onSubmitComment }) => {
  const [content, setContent] = useState("");
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() !== "") {
      // TODO: infer user from session
      const comment = {
        user: "TestUser",
        content,
        timestamp: new Date(),
      };
      onSubmitComment(comment);
      // reset the form state
      setContent("");
    }
  };
  return (
    <form onSubmit={handleCommentSubmit}>
      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default NewComment;
