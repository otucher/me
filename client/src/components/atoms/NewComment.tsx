// src/components/CommentForm.tsx
import React, { useState } from "react";

export interface Comment {
  id: number;
  user: string;
  content: string;
  timestamp: Date;
}

const CommentForm: React.FC = () => {
  const [newComment, setNewComment] = useState<Comment>({
    id: 0, // You may generate a unique id using a library or another method
    user: "",
    content: "",
    timestamp: new Date(),
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment({
      ...newComment,
      user: e.target.value,
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment({
      ...newComment,
      content: e.target.value,
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.user.trim() !== "" && newComment.content.trim() !== "") {
      console.log("Pushing new comment to database", newComment);
      // Reset the form state
      setNewComment({
        id: 0,
        user: "",
        content: "",
        timestamp: new Date(),
      });
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <label htmlFor="user">User:</label>
      <input
        type="text"
        id="user"
        value={newComment.user}
        onChange={handleUserChange}
      />

      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={newComment.content}
        onChange={handleContentChange}
      />

      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
