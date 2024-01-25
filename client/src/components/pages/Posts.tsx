import React from "react";
import Post, { PostProps } from "../organisms/Post";

const Posts: React.FC = () => {
  const posts: PostProps[] = [
    {
      title: "My first post",
      content: "This is my first post. I hope you like it!",
      user: "Oliver",
      timestamp: new Date(),
      comments: [
        { id: 1, user: "Jane", content: "I like this post!", timestamp: new Date() },
        { id: 2, user: "Bob", content: "This post was alright.", timestamp: new Date() }
      ],
      likes: [
        { user: "Jane" },
        { user: "Bob" }
      ]
    }
  ];
  return (
    <div className="posts">
      {posts.map((post, idx) => (
        <Post key={idx} {...post} />
      ))}
    </div>
  );
};

export default Posts;
