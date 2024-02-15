import React, { useEffect, useState } from "react";
import { IPost, IUser } from "./models";
import instance from "./api";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./amplify";
import { Hub } from "aws-amplify/utils";
import NavBar from "./components/organisms/NavBar/NavBar";
import About from "./components/pages/About/About";
import Footer from "./components/organisms/Footer/Footer";
import Posts from "./components/pages/Posts/Posts";
import User from "./components/pages/User/User";
import Post from "./components/pages/Post/Post";
import "./App.css";

const App: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    instance.get("/posts").then((response) => setPosts(response.data));
    getUser()
      .then(setUser)
      .catch((err) => {
        if (err.message.includes("id token not found")) return;
      });
  }, []);

  Hub.listen("auth", ({ payload }): void => {
    if (payload.event === "signInWithRedirect") getUser().then(setUser);
    else if (payload.event === "signInWithRedirect_failure") alert("signInWithRedirect_failure :(");
  });

  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route key={0} path="/" element={<About />} />
        <Route key={0} path="/user" element={<User user={user} />} />
        <Route key={1} path="/posts" element={<Posts posts={posts} />} />
        {posts.map((post, idx) => (
          <Route key={idx + 2} path={`/posts/${post.id}`} element={<Post user={user} post={post} />} />
        ))}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
