import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, handleLogout, setActivePage }) => {
  return (
    <nav className="navbar">
      <h1>AI Learning Platform</h1>
      <ul className="nav-links">
        <li onClick={() => setActivePage("home")}><Link to="#">Home</Link></li>
        <li onClick={() => setActivePage("milestone")}><Link to="#">Milestone</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <div>
        {user ? (
          <div className="user-info">
            <span>{user.email}</span>
            <button className="login-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
