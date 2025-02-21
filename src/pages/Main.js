import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Home from "./Home";
import Milestones from "./Milestones"; 
import "../styles/Home.css";

const Main = () => {
  const [user, setUser] = useState(null);
  const [interest, setInterest] = useState(""); // Store interest separately
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from Firestore
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log("Fetched user data in Main.js:", userData);
          if (userData.interest) {
            setInterest(userData.interest);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("rememberMe");
    setActivePage("home");
  };

  return (
    <div className="main-container">
      <Navbar user={user} handleLogout={handleLogout} setActivePage={setActivePage} />
      {activePage === "home" ? <Home user={user} interest={interest} /> : <Milestones interest={interest} />}
    </div>
  );
};

export default Main;
