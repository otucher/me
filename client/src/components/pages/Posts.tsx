import React from "react";
import Post, { PostProps } from "../organisms/Post";

var posts: PostProps[] = [
  {
    post: {
      id: 0,
      title: "My first post",
      content: "This is my first post. I hope you like it!",
      user: "Oliver",
      timestamp: new Date(),
    },
    comments: [
      {
        user: "Jane",
        content: "I like this post!",
        timestamp: new Date(),
        likes: [
          { user: "John" },
          { user: "John" },
        ],
      },
      {
        user: "Bob",
        content: "This post was alright.",
        timestamp: new Date(),
        likes: [{ user: "Bob" }],
      },
    ],
    likes: [
      { user: "Jane" },
      { user: "Bob" }
    ],
  },
];

const Posts: React.FC = () => {
  // TODO: fetch posts from server
  return (
    <div className="posts">
      {posts.map((post, idx) => (
        <Post key={idx} {...post} />
      ))}
    </div>
  );
};

export default Posts;
