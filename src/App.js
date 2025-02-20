// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoadmapDetail from "./pages/RoadmapDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/roadmap/:interest/:milestoneId" element={<RoadmapDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
