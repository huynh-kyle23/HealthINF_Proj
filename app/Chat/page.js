'use client';
import React, { useState, useEffect } from "react";
import BotMessage from "../../components/BotMessage"
import UserMessage from "@/components/User_Messages";
import Messages from "@/components/Messages";
import Input from "@/components/get_Input";
import Header from "@/components/Title";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);

  useEffect(() => {
    async function initChat() {
      try {
        setMessages([
          <BotMessage
            key="0"
            message="Can you say: Hello I am here for you"
          />
        ]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    }
    initChat();
  }, []);

  const send = async text => {
    const newMessages = messages.concat(
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage
        key={messages.length + 2}
        message={text}
      />
    );
    setMessages(newMessages);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <Messages messages={messages} />
      <Input onSend={send} />
    </div>
  );
}