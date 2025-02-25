"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function JamendoPlayer({ tasks = [], onTaskUpdate = () => {} }) {
  const [value, setValue] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserInitiated, setIsUserInitiated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // New state for volume control
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [ambienceVolume, setAmbienceVolume] = useState(0.5);
  const [showMixer, setShowMixer] = useState(false);

  // Refs for audio elements
  const musicAudioRef = useRef(null);
  const ambienceAudioRef = useRef(null);

  const clientId = process.env.NEXT_PUBLIC_API_KEY;

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
  }, [clientId]);

  // Initialize and handle the background ambience audio
  useEffect(() => {
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.src = "/cafeAmbience.mp3";
      ambienceAudioRef.current.loop = true; // Loop the ambience
      ambienceAudioRef.current.volume = ambienceVolume;

      // Play ambience when user has initiated audio
      if (isUserInitiated) {
        (async () => {
          try {
            await ambienceAudioRef.current.play();
          } catch (err) {
            if (err.name !== "AbortError") {
              console.error("Ambience play failed:", err);
            }
          }
        })();
      }
    }
  }, [isUserInitiated, ambienceVolume]);

  // Update music track when current track changes
  useEffect(() => {
    if (musicAudioRef.current && tracks.length > 0) {
      musicAudioRef.current.src = tracks[currentTrackIndex].audio;
      musicAudioRef.current.load();
      musicAudioRef.current.volume = musicVolume;
      if (isUserInitiated && isPlaying) {
        (async () => {
          try {
            await musicAudioRef.current.play();
          } catch (err) {
            if (err.name !== "AbortError") {
              console.error("Music play failed:", err);
            }
          }
        })();
      }
    }
  }, [currentTrackIndex, tracks.length, isUserInitiated, isPlaying, musicVolume]);

  // Update volume when sliders change
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.volume = ambienceVolume;
    }
  }, [ambienceVolume]);

  useEffect(() => {
    const handleIncrement = (prev) => (prev === 100 ? 0 : prev + 10);
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = async () => {
    if (musicAudioRef.current && ambienceAudioRef.current) {
      try {
        await musicAudioRef.current.play();
        setIsUserInitiated(true);
        setIsPlaying(true);
        try {
          await ambienceAudioRef.current.play();
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Ambience play failed:", err);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Play failed:", err);
        }
      }
    }
  };

  const handlePlayPause = async () => {
    if (musicAudioRef.current) {
      if (isPlaying) {
        musicAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await musicAudioRef.current.play();
          setIsUserInitiated(true);
          // Only start the ambience if it isn't already playing
          if (ambienceAudioRef.current && !isUserInitiated) {
            try {
              await ambienceAudioRef.current.play();
            } catch (err) {
              if (err.name !== "AbortError") {
                console.error("Ambience play failed:", err);
              }
            }
          }
          setIsPlaying(true);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Play failed:", err);
          }
        }
      }
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

  const toggleMixer = () => {
    setShowMixer(!showMixer);
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
      {/* Background ambience audio */}
      <audio ref={ambienceAudioRef} className="hidden" />

      {/* Music player audio */}
      <audio
        ref={musicAudioRef}
        className="hidden"
        onEnded={handleNextTrack}
      />

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
            <h1 className="text-4xl font-light text-white mb-4">lofi café</h1>
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
            {/* Custom Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrevTrack}
                className="text-white hover:text-white/75 transition-colors p-3 rounded-full bg-white/20 hover:bg-white/30"
                aria-label="Previous track"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 20L9 12L19 4V20Z M5 19V5" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="text-white hover:text-white/75 transition-colors p-4 rounded-full bg-white/20 hover:bg-white/30"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 8H15V24H10V8ZM17 8H22V24H17V8Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 8L28 20L10 32V8Z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="text-white hover:text-white/75 transition-colors p-3 rounded-full bg-white/20 hover:bg-white/30"
                aria-label="Next track"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 4L15 12L5 20V4Z M19 5V19" />
                </svg>
              </button>
            </div>

            {/* Audio Mixer Button */}
            <button
              onClick={toggleMixer}
              className="mt-4 text-white hover:text-white/75 transition-colors px-4 py-2 rounded-full bg-white/20 hover:bg-white/30"
            >
              {showMixer ? "Hide Mixer" : "Show Mixer"}
            </button>

            {/* Audio Mixer Panel */}
            {showMixer && (
              <div className="mt-6 w-full bg-black/30 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-white text-lg font-medium mb-4">
                  Audio Mixer
                </h3>

                {/* Music Volume Control */}
                <div className="mb-4">
                  <div className="flex justify-between text-white/80 text-sm mb-1">
                    <span>Music</span>
                    <span>{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Ambience Volume Control */}
                <div>
                  <div className="flex justify-between text-white/80 text-sm mb-1">
                    <span>Café Ambience</span>
                    <span>{Math.round(ambienceVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={ambienceVolume}
                    onChange={(e) => setAmbienceVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
