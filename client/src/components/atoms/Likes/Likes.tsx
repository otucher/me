import React, { useState, useEffect } from "react";
import { ILike, IUser } from "../../../models";
import axiosInstance from "../../../axiosInstance";
import { Without, Optimistic, isOptimistic } from "../../../utils";
import "./style.css";

interface Props {
  user?: IUser;
  postId?: number;
  commentId?: number;
}

const Likes: React.FC<Props> = ({ user, postId, commentId }) => {
  var endpoint: string;
  if ((postId && commentId) || (!postId && !commentId)) {
    throw new Error("Invalid arguments: Either postId or commentId must be defined.");
  } else if (postId !== undefined) {
    endpoint = `/posts/${postId}/likes`;
  } else {
    endpoint = `/comments/${commentId}/likes`;
  }

  const [likes, setLikes] = useState<Optimistic<Without<ILike>>[]>([]);
  const getLikes = () => {
    axiosInstance.get(endpoint).then((response) => setLikes(response.data));
  };

  useEffect(getLikes, [endpoint]);

  const handleLike = (user: IUser) => {
    const newLike: Without<ILike> = {
      post_id: postId,
      comment_id: commentId,
      user_id: user.id,
    };
    setLikes([...likes, { ...newLike, isOptimistic: true }]);
    axiosInstance.post("/likes", newLike).then(getLikes);
  };

  const handleRemoveLike = (user: IUser) => {
    axiosInstance.delete(`${endpoint}/${user.id}`).then(getLikes);
  };

  const numLikes = likes.length;
  const likers = likes.map((like) => like.user_id);
  return (
    <div className="likes" style={{ opacity: isOptimistic(likes) ? 0.5 : undefined }}>
      <p>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </p>
      {!user ? (
        <p>Log in to like</p>
      ) : !likers.includes(user.id) ? (
        <button onClick={() => handleLike(user)}>Like</button>
      ) : (
        <button onClick={() => handleRemoveLike(user)}>Remove Like</button>
      )}
    </div>
  );
};

export default Likes;
