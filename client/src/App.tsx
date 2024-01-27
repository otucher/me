import React, { useEffect, useState } from "react";
import "./App.css";
import { Post } from "./models";
import instance from "./axiosInstance";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/organisms/NavBar";
import About from "./components/pages/About";
import Footer from "./components/organisms/Footer";
import Posts from "./components/pages/Posts";
import Header from "./components/organisms/NavBar";
import PostComponent from "./components/pages/Post";

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    instance.get("/posts")
      .then(response => setPosts(response.data))
  }, []);

  return (
    <div className="app">
      <Header />
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/posts" element={<Posts posts={posts} />} />
        {posts.map((post) => (
          <Route path={`/posts/${post.id}`} element={<PostComponent {...post} />} />
        ))}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
