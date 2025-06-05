"use client";

import React, { useState } from "react";
import Input from "@/components/Inputs"; 
import Button from "@/components/Button"; 

interface Message {
  role: string;
  content: string;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botReply: Message = {
      role: "bot",
      content: `Hola! He recibido: "${input}". ¿En qué más puedo ayudarte?`,
    };
    setMessages((prevMessages) => [...prevMessages, botReply]);
    setInput("");
  };

  return (
    <div className="chatbot-widget">
      <Button
        buttonLabel="💬"
        onButtonClick={toggleChat}
        buttonType="light"
        className="chatbot-toggle fixed bottom-6 right-6 p-3 rounded-full shadow-lg hover:bg-blue-400"
      />

      {isOpen && (
        <div className="chatbox fixed bottom-16 right-6 w-80 bg-white border rounded-lg shadow-lg p-4">
          <div className="messages h-64 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`${
                  msg.role === "user" ? "text-right text-brown-500" : "text-left text-yellow-600"
                }`}
              >
                {msg.content}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between w-full max-w-md mx-auto">
            <Input
              type="text"
              name="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              label=""
              required={false}
              className="w-3/4 pl-0.5 pr-0.5 px-2 py-1 text-sm rounded-l"
            />
            <Button
              buttonLabel="Enviar"
              onButtonClick={handleSendMessage}
              buttonType="dark"
              className="m-1 mb-6.5 pt-2.5 pb-2 pl-3.5 pr-3 rounded-r"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
