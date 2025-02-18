import { useState } from "react";

const Input = ({ onSend }) => {
    const [text, setText] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!text.trim()) return;
      onSend(text);
      setText("");
    };
  
    return (
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex space-x-4 text-neutral-900">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    );
  };

  export default Input
