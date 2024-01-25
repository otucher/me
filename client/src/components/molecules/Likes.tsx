import React, { useState } from "react";

export interface Like {
  user: string;
}

interface LikesProps {
  likes: Like[];
}

const Likes: React.FC<LikesProps> = ({ likes }) => {
  const numLikes = likes.length;

  const handleLike = () => {
    console.log("Pushing like to database");
  };

  return (
    <div className="likes">
      <button onClick={handleLike}>Like</button>
      <p>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </p>
    </div>
  );
};

export default Likes;
