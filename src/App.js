import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoadmapDetail from "./pages/RoadmapDetail"; // Ensure correct path

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Home Page */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Roadmap Detail Route (Handles Dynamic Params) */}
        <Route path="/roadmap/:interest/:milestoneId" element={<RoadmapDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
