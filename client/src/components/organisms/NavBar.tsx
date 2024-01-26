import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        {/* Add more links as needed for your application */}
      </ul>
    </nav>
  );
};

export default Header;
