import React from "react";
import { Like } from "../../../models";
import "./style.css";

interface LikesProps {
  likes: Like[];
  handleLike: () => void;
  handleRemoveLike: () => void;
}

const Likes: React.FC<LikesProps> = ({ likes, handleLike, handleRemoveLike }) => {
  const numLikes = likes.length;
  return (
    <div className="likes">
      <button onClick={handleLike}>Like</button>
      <button onClick={handleRemoveLike}>Remove Like</button>
      <p>{numLikes} {numLikes === 1 ? "like" : "likes"}</p>
    </div>
  );
};

export default Likes;
