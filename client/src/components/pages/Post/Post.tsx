import React, { useEffect, useState } from "react";
import { IPost, IUser } from "../../../models";
import Comments from "../../organisms/Comments/Comments";
import Likes from "../../atoms/Likes/Likes";
import axiosInstance from "../../../axiosInstance";
import "./style.css";

interface Props {
  post: IPost;
  user?: IUser;
}

const Post: React.FC<Props> = ({ post, user }) => {
  // get post user info
  const [postUser, setPostUser] = useState<IUser>();
  useEffect(() => {
    axiosInstance.get(`/users/${post.user_id}`).then((response) => setPostUser(response.data));
  }, [post]);

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-meta">
        <p>Author: {postUser?.email}</p>
        <Likes user={user} postId={post.id} />
        <Comments user={user} postId={post.id} />
      </div>
    </div>
  );
};

export default Post;
