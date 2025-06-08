// src/context/ChatContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

type ChatMessage = {
  role: string;
  content: string;
  timestamp: string;
};

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("career_chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages to localStorage on every update
  useEffect(() => {
    localStorage.setItem("career_chat", JSON.stringify(messages));
  }, [messages]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
