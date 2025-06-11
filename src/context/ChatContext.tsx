// src/context/ChatContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useMemo } from "react";

type ChatMessage = {
  role: string;
  content: string;
  timestamp: string;
};

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages from localStorage only once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("career_chat");
      if (saved) {
        const parsedMessages = JSON.parse(saved);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("career_chat", JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save chat messages:', error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("career_chat");
  }, []);

  const contextValue = useMemo(() => ({
    messages,
    setMessages,
    addMessage,
    clearMessages
  }), [messages, addMessage, clearMessages]);
  return (
    <ChatContext.Provider value={contextValue}>
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
