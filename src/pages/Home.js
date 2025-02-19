import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css"; // Import Home CSS

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("rememberMe");
    navigate("/"); // Redirect to Home after logout
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>AI Learning Platform</h1>
        <div>
          {user ? (
            <div className="user-info">
              <span>{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>
      <div className="home-content">
        <h2>Welcome to AI Learning</h2>
        <p>Enhance your skills with AI-powered learning.</p>
      </div>
    </div>
  );
};

export default Home;
