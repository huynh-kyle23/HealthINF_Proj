"use client";

import Image from "next/image";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

const { GoogleGenerativeAI } = require("@google/generative-ai");
const secretKey = process.env.NEXT_PUBLIC_API_KEY;

const genAI = new GoogleGenerativeAI(secretKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain how AI works";

export default function Home() {
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateExplanation = async () => {
    try {
      setIsLoading(true);
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      setAiResponse(response);
    } catch (error) {
      console.error('Error:', error);
      setAiResponse("Sorry, I couldn't generate a response at the moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-semibold text-primary-600">AI Explorer</div>
            <Link 
              href="/Chat" 
              className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Open Chat</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 animate-fade-in">
            Explore the Power of AI
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto animate-fade-in">
            Get instant explanations about artificial intelligence and dive deep into the world of machine learning.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerateExplanation}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl 
                         transition-all shadow-button hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Generate Explanation
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">How AI Works:</h2>
              <p className="text-neutral-700 whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}

          {/* Chat Link Card */}
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-2xl border border-primary-200">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-primary-900">
                Want to dive deeper?
              </h2>
              <p className="text-primary-700">
                Try our interactive chat interface for more detailed conversations about AI.
              </p>
              <Link 
                href="/Chat"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white 
                           rounded-xl transition-all shadow-button hover:shadow-lg"
              >
                Start Chatting
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}