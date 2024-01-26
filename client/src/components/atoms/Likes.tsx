import React, { useState, useEffect } from "react";

export interface Like {
  user: string;
}

interface OptimisticLike extends Like {
  isOptimistic?: boolean;
}

interface LikesProps {
  likes: Like[];
}

const Likes: React.FC<LikesProps> = ({ likes }) => {
  const [optimisticLikes, setOptimisticLikes] =
    useState<OptimisticLike[]>(likes);
  const handleLike = () => {
    // TODO: make a request to the server to add a like
    // TODO: infer user from session
    setOptimisticLikes([...likes, { user: "Tester", isOptimistic: true }]);
  };

  // any time the likes prop changes, update the optimisticLikes state so that no likes are optimistic
  useEffect(() => {
    setOptimisticLikes(likes);
  }, [likes]);

  const numLikes = optimisticLikes.length;
  const isNumLikesOptimistic =
    optimisticLikes.filter((like) => like.isOptimistic).length > 0;
  return (
    <div className="likes">
      <button onClick={handleLike}>Like</button>
      <p style={{ opacity: isNumLikesOptimistic ? 0.5 : undefined }}>
        {numLikes} {numLikes === 1 ? "like" : "likes"}
      </p>
    </div>
  );
};

export default Likes;
