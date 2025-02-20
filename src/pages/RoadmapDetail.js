import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const YOUTUBE_API_KEY = "AIzaSyA2Eo-548ulXmqHec8iRCSd9yA_7lQZJdw"; // Replace with your API Key

const RoadmapDetail = () => {
  const { interest } = useParams();
  const location = useLocation();
  const milestoneName = location.state?.milestoneName || "Unknown Milestone";
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    const fetchYouTubeVideo = async () => {
      const searchQuery = `${milestoneName} ${interest} best tutorial guide explained`;

    
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}&maxResults=5&type=video&eventType=completed`;

    
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log("YouTube API Raw Response:", data); // Log full response for debugging
    
        if (!data.items || data.items.length === 0) {
          console.error("No YouTube videos found for this query.");
          return;
        }
    
        const validVideo = data.items.find(item => item.id.kind === "youtube#video");
    
        if (validVideo) {
          const videoId = validVideo.id.videoId;
          setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
        } else {
          console.error("No relevant YouTube video found.");
        }
        
      } catch (error) {
        console.error("Error fetching YouTube video:", error);
      }
    };
    
    
    

    fetchYouTubeVideo();
  }, [milestoneName, interest]);

  return (
    <div>
      <h1>Roadmap for {decodeURIComponent(interest)}</h1>
      <h2>Milestone: {milestoneName}</h2>

      {videoUrl ? (
        <div style={{ width: "50%", height: "400px", marginLeft: "10px", paddingTop: "20px" }}>
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>Loading video...</p>
      )}

    </div>
  );
};

export default RoadmapDetail;
