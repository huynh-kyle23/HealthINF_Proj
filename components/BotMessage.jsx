import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const secretKey = process.env.NEXT_PUBLIC_API_KEY;
const genAI = new GoogleGenerativeAI(secretKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Changed to pro model for better stability



const BotMessage = ({ message }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResponse = async () => {
      try {
        // Create a proper prompt
  
        const prompt = {
          contents: [{
            parts: [{ text: message }],
          }],
        };

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
      } catch (error) {
        console.error('Error getting response:', error);
        setResponse("I'm sorry, I encountered an error processing your request.");
      } finally {
        setLoading(false);
      }
    };

    getResponse();
  }, [message]);

  return (
    <div className="flex w-full mb-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
      <div className="bg-gray-100 rounded-lg p-4 max-w-[80%] text-neutral-900">
        {loading ? (
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        ) : (
          <div className="whitespace-pre-wrap prose prose-neutral max-w-none">{response}</div>
        )}
      </div>
    </div>
  );
};
 export default BotMessage