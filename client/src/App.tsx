import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/organisms/NavBar';
import About from './components/pages/About';
import Footer from './components/organisms/Footer';
import Posts from './components/pages/Posts';
import Header from './components/organisms/NavBar';

const App: React.FC = () => (
  <Router>
    <div className="app">
      <Header />
      <NavBar />
      <Routes>
      <Route path="/" element={<About />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

export default App;
