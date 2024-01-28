import React, { useState } from "react";
import "./style.css";

interface NewCommentProps {
  onSubmitCommentContent: (commentContent: string) => void;
}

const NewComment: React.FC<NewCommentProps> = ({ onSubmitCommentContent }) => {
  const [commentContent, setCommentContent] = useState("");
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim() !== "") {
      onSubmitCommentContent(commentContent);
      // reset the form state
      setCommentContent("");
    }
  };
  return (
    <form onSubmit={handleCommentSubmit}>
      <label>Content:</label>
      <textarea id="content" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default NewComment;
