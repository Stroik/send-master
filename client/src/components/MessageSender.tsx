import React, { useState } from "react";
import { socket } from "../lib/socket";

const MessageSender: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        socket.emit("send-message", { message });
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div>
      <div className="join">
        <input
          className="input input-bordered join-item"
          placeholder="Type something"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn join-item rounded-r-full" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageSender;
