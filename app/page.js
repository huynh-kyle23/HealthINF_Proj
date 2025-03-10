"use client";
import React, { useEffect, useState } from 'react';
import StudySettingsGrid from "../components/Grid";
import StudyEnvironmentCarousel from "../components/CarouselImg";
import {AnimatedListDemo} from '../components/features_list';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex flex-col">
      {/* Rounded content container */}
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          
          {/* Navigation */}
          <header className={`flex justify-between items-center mb-16 transition-all duration-700 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'}`}>
            <div className="flex items-center gap-3">
              <img 
                src="/logo.webp" 
                alt="Lofi Cafe Logo" 
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-bold text-amber-900">Lofi Cafe</h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
            </div>
          </header>

          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className={`flex flex-col justify-center transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-4">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">FREE STUDY ENVIRONMENT</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                The perfect sounds for deep focus.
              </h2>
              
              <p className="text-gray-600 mb-8">
                Aimed to aid college students that struggle with deep focus and effective
                studying.
                Enhance your study sessions with customizable ambient soundscapes.
                Find your flow state with Lofi Cafe's immersive audio environments.
              </p>
              
              <div className="flex flex-wrap gap-4">
              </div>
            </div>
            
            {/* Replace the image with the carousel component */}
            <div className={`flex items-center justify-center transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
              <StudyEnvironmentCarousel />
            </div>
          </div>

          {/* Features Section */}
          <div className={`grid md:grid-cols-2 gap-12 mb-16 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
            {/* Animated List Demo */}
            <div>
              <AnimatedListDemo />
            </div>
            {/* Notable Features Description */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notable Features</h2>
              <p className="text-gray-600 mb-6">
                Our extensive user research of UCI undergraduate students revealed that many struggle with 
                maintaining focus during study sessions. We identified key pain points including distracting environments, 
                difficulty getting into a flow state, and burnout from extended study periods.
              </p>
              <p className="text-gray-600 mb-6">
                Based on this research, we've carefully crafted Lofi Cafe to address these specific challenges.
                Our platform incorporates evidence-based audio techniques that have been shown to improve concentration
                and reduce anxiety, creating the optimal conditions for deep focus and effective learning.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1 w-16 bg-amber-400 rounded-full"></div>
                <span className="text-amber-600 font-medium">Designed with students, for students</span>
              </div>
            </div>
            

          </div>

          {/* Study Settings Grid */}
          <div className={`transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl font-medium text-gray-700 mb-6">TRY OUT ONE OF OUR ENVIRONMENTS</h2>
            <StudySettingsGrid />
          </div>

          {/* Trust Section */}
          <div className={`mt-16 text-center transition-all duration-700 delay-900 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm text-gray-500 mb-8">
              Trusted by students and professionals to boost productivity
            </p>
            <div className="flex justify-center flex-wrap gap-8">
              <div className="text-gray-300 font-medium">University</div>
              <div className="text-gray-300 font-medium">ProductHunt</div>
              <div className="text-gray-300 font-medium">Students</div>
              <div className="text-gray-300 font-medium">Creators</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}