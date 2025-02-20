import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Import Firebase authentication & Firestore
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import LeftPanel from "../components/LeftPanel";  // Adjust the path if needed
import RightPanel from "../components/RightPanel"; // Adjust the path if needed
import "../styles/Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [interest, setInterest] = useState("Not Found");
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user interest from Firestore
  useEffect(() => {
    const fetchInterest = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setInterest(userData.interest);
          } else {
            setInterest("Not Found");
          }
        } catch (error) {
          console.error("Error fetching interest:", error);
          setInterest("Error fetching data");
        }
      }
    };

    fetchInterest();
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("rememberMe");
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="home-container">
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="main-content">
        <LeftPanel />
        <RightPanel interest={interest} />
      </div>
    </div>
  );
};

export default Home;
