import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // ✅ Import existing styles

const interestsList = [
  "Artificial Intelligence (AI)", "Machine Learning (ML)", "Deep Learning",
  "Data Science", "Cybersecurity", "Ethical Hacking", "Cloud Computing",
  "Internet of Things (IoT)", "Embedded Systems", "Full-Stack Development",
  "Frontend Development", "Backend Development", "Mobile App Development (Android, iOS)",
  "Web Development", "React", "Angular", "Vue.js", "JavaScript", "TypeScript",
  "Python", "Java", "C++", "C#", "Kotlin", "Swift", "Blockchain", "Web3",
  "Smart Contracts", "Computer Vision", "Natural Language Processing (NLP)",
  "DevOps", "Networking", "Database Management Systems (DBMS)",
  "SQL & NoSQL Databases", "Operating Systems", "Digital Signal Processing (DSP)",
  "Robotics", "Quantum Computing", "Augmented Reality (AR)", "Virtual Reality (VR)",
  "Game Development", "Human-Computer Interaction (HCI)", "UI/UX Design",
  "Software Testing & Quality Assurance", "System Design & Architecture",
  "High-Performance Computing (HPC)", "Automation & Scripting", "Big Data",
  "Edge Computing", "Bioinformatics", "Aerospace & Space Tech",
  "Smart Cities & Sustainable Tech", "Digital Twin Technology",
  "AI-powered Personalized Learning"
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const navigate = useNavigate();

  // Move to Step 2
  const handleNext = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill out both fields.");
      return;
    }
    setStep(2);
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedInterest) {
      alert("Please select an interest.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user interest in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        interest: selectedInterest,
      });

      alert("Registration successful!");
      navigate("/home");
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>

        {step === 1 ? (
          // Step 1: Email & Password
          <form onSubmit={handleNext}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Next</button>
          </form>
        ) : (
          // Step 2: Interests
          <form onSubmit={handleRegister}>
            <h3>Select Field of Interest</h3>
            <div className="interests-container">
              {interestsList.map((interest, index) => (
                <button
                  key={index}
                  type="button"
                  className={`interest-button ${selectedInterest === interest ? "selected" : ""}`}
                  onClick={() => setSelectedInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            <button type="submit">Select Field of Interest</button>
          </form>
        )}

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
