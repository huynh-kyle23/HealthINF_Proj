"use client";
import { useState, useEffect, useRef } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../../components/ui/sidebar";
import { IconHome, IconMusic } from "@tabler/icons-react";

export default function JamendoPlayer() {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserInitiated, setIsUserInitiated] = useState(false);
  const audioRef = useRef(null);

  const clientId = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&fuzzytags=lounge&limit=10`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch tracks");
        }
        const data = await res.json();
        if (data && data.results && data.results.length > 0) {
          setTracks(data.results);
        } else {
          throw new Error("No tracks found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTracks();
  }, []);

  // Update track when currentTrackIndex changes, but only attempt to play if user already interacted
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex].audio;
      audioRef.current.load();
      if (isUserInitiated) {
        audioRef.current
          .play()
          .catch((err) => console.error("Play failed:", err));
      }
    }
  }, [currentTrackIndex, tracks, isUserInitiated]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsUserInitiated(true);
        })
        .catch((err) => console.error("Play failed:", err));
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div>Loading Jamendo tracks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar>
        <SidebarBody>
          <SidebarLink
            link={{ href: "/", label: "Home", icon: <IconHome /> }}
          />
          <SidebarLink
            link={{ href: "/music", label: "Music", icon: <IconMusic /> }}
          />
          {/* Add more SidebarLink components as needed */}
        </SidebarBody>
      </Sidebar>

      {/* Main content area */}
      <main style={{ flex: 1, padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Jamendo Music Player</h1>
        {currentTrack && (
          <div>
            <h2>{currentTrack.name}</h2>
            <p>Artist: {currentTrack.artist_name}</p>
            <audio
              ref={audioRef}
              controls
              style={{ width: "100%" }}
              onEnded={handleNextTrack}
            >
              Your browser does not support the audio element.
            </audio>
            {/* Show play button only if user hasn't started playback yet */}
            {!isUserInitiated && <button onClick={handlePlay}>Play</button>}
            <div>
              <button onClick={handlePrevTrack}>Previous</button>
              <button onClick={handleNextTrack}>Next</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}