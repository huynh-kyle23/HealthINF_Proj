"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatedCircularProgressBar } from "../../../components/magicui/animated-circular-progress-bar";

import Image from "next/image"

export default function JamendoPlayer({ tasks = [], onTaskUpdate = () => {} }) {
  const [value, setValue] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserInitiated, setIsUserInitiated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const clientId = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    if (tasks) {
      console.log("Current tasks:", tasks);
    }
  }, [tasks]);
  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&fuzzytags=lofi&limit=10`
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

  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex].audio;
      audioRef.current.load();
      if (isUserInitiated) {
        audioRef.current.play().catch((err) => console.error("Play failed:", err));
      }
    }
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    const handleIncrement = (prev) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsUserInitiated(true))
        .catch((err) => console.error("Play failed:", err));
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .then(() => setIsUserInitiated(true))
          .catch((err) => console.error("Play failed:", err));
      }
      setIsPlaying(!isPlaying);
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
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full">
        <Image
          src="/CafeImg.png"
          alt="Cozy café interior"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          {/* Timer-like display for track info */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-white mb-4">
              lofi café
            </h1>
            {currentTrack && (
              <div className="text-white/90">
                <h2 className="text-6xl font-bold mb-4 font-mono">
                  {currentTrack.name.length > 20 
                    ? currentTrack.name.substring(0, 20) + "..."
                    : currentTrack.name}
                </h2>
                <p className="text-xl opacity-75">
                  {currentTrack.artist_name}
                </p>
              </div>
            )}
          </div>

          {/* Audio Controls */}
          <div className="flex flex-col items-center gap-6">
            <audio 
              controls={false}
              ref={audioRef}
              className="hidden"
              onEnded={handleNextTrack}
            >
              Your browser does not support the audio element.
            </audio>

            {/* Custom Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrevTrack}
                className="text-white hover:text-white/75 transition-colors p-3 rounded-full bg-white/20 hover:bg-white/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 20L9 12L19 4V20Z M5 19V5" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="text-white hover:text-white/75 transition-colors p-4 rounded-full bg-white/20 hover:bg-white/30"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 8H15V24H10V8ZM17 8H22V24H17V8Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 8L28 20L10 32V8Z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="text-white hover:text-white/75 transition-colors p-3 rounded-full bg-white/20 hover:bg-white/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 4L15 12L5 20V4Z M19 5V19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}