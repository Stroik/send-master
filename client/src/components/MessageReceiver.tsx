import React, { useEffect, useState } from "react";
import { socket } from "../lib/socket";

const MessageReceiver: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <div>
      <h2>Received Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageReceiver;
