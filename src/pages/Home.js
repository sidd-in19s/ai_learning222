import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../styles/Home.css";

const genAI = new GoogleGenerativeAI("AIzaSyAcIrHfWopVExYUghj5h-RyfnkvGohY7QQ");

const Home = ({ user }) => {
  const [interest, setInterest] = useState("Not Found");
  const [fact, setFact] = useState("Loading...");
  const [milestonesCompleted, setMilestonesCompleted] = useState(0);

  useEffect(() => {
    const fetchInterest = async () => {
      if (user) {
        try {
          const q = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log("Fetched user data:", userData); // Debugging log
            if (userData.interest) {
              setInterest(userData.interest);
              fetchFact(userData.interest);
            } else {
              console.warn("Interest not found in user data");
              setInterest("Not Found");
            }
          } else {
            console.warn("No user document found");
            setInterest("Not Found");
          }
        } catch (error) {
          console.error("Error fetching interest:", error);
          setInterest("Error fetching data");
        }
      }
    };
    

    const fetchFact = async (topic) => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Give me a short, interesting information (2-3 lines) about ${topic}, as i am student learning about this.`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        setFact(response.text() || "No fact available.");
      } catch (error) {
        console.error("Error fetching fact:", error);
        setFact("Error fetching fact");
      }
    };

    fetchInterest();
  }, [user]);

  return (
    <div className="home-container">
      {/* Section 1: Area of Interest & Fact */}
      <section className="interest-section">
        <h2>Area of Interest: {interest}</h2>
        <p>{fact}</p>
      </section>

      {/* Section 2: Milestones Completed */}
      <section className="milestone-section">
        <h3>Milestones Completed</h3>
        <div className="progress-circle">{milestonesCompleted}%</div>
      </section>

      {/* Section 3: Footer */}
      <footer className="footer">
        <p>&copy; 2025 LIS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
