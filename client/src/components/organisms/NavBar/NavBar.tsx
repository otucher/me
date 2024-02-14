import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Header: React.FC = () => {
  return (
    <div className="navbar">
      <nav className="navbar-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/user">User</Link>
          </li>
          {/* Add more links as needed for your application */}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
