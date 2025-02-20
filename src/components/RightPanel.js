import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore instance
import "../styles/Home.css";

const GEMINI_API_KEY = "AIzaSyAcIrHfWopVExYUghj5h-RyfnkvGohY7QQ";

const RightPanel = ({ interest }) => {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!interest || interest === "Not Found" || interest === "Error fetching data") return;

      setLoading(true);

      const roadmapRef = doc(db, "milestone", interest);

      try {
        // 1️⃣ Check Firestore for existing milestones
        const docSnap = await getDoc(roadmapRef);
        if (docSnap.exists()) {
          console.log("Fetching roadmap from Firestore...");
          setRoadmap(docSnap.data().milestones);
        } else {
          console.log("No roadmap found, generating using Gemini...");

          // 2️⃣ Generate milestones using Gemini
          const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });

          const prompt = `Generate a structured learning roadmap for ${interest}. 
          Include key milestones such as beginner, intermediate, and advanced topics.
          Format the response as a clear list of milestones.`;

          const result = await model.generateContent(prompt);
          const response = await result.response.text();

          const roadmapSteps = response
            .split("\n")
            .map(step => step.trim())
            .filter(step => step !== "");

          if (roadmapSteps.length > 0) {
            // 3️⃣ Store generated milestones in Firestore
            await setDoc(roadmapRef, { milestones: roadmapSteps });

            // 4️⃣ Set state with new milestones
            setRoadmap(roadmapSteps);
          } else {
            console.error("Gemini response was empty or invalid.");
          }
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      }

      setLoading(false);
    };

    fetchRoadmap();
  }, [interest]);

  const handleMilestoneClick = (milestone, index) => {
    navigate(`/roadmap/${encodeURIComponent(interest)}/${index + 1}`, {
      state: { milestoneName: milestone }, // Passing milestone name
    });
  };

  return (
    <div className="right-panel">
      <h2>Personalized Learning Dashboard</h2>

      <div className="card">
        <h3 className="section-title">Area of Interest</h3>
        <p>{interest}</p>
      </div>

      <div className="card">
        <h3 className="section-title">Personalized Roadmap (Timeline)</h3>
        <ul>
          {loading ? (
            <li>Loading roadmap...</li>
          ) : roadmap.length > 0 ? (
            roadmap.map((milestone, index) => (
              <li key={index}>
                <Link
                  to={`/roadmap/${encodeURIComponent(interest)}/${index + 1}`}
                  state={{ milestoneName: milestone }}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default to allow onClick navigation
                    handleMilestoneClick(milestone, index);
                  }}
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                >
                  <strong>Milestone {index + 1}:</strong> {milestone}
                </Link>
              </li>
            ))
          ) : (
            <li>No roadmap available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;
