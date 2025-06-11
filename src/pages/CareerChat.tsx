import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { useChat } from "../context/ChatContext";

const CareerChat = () => {
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  // Auto-scroll to bottom of chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input, timestamp: getTime() },
    ];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await axios.post(`${apiUrl}/api/chat`, {
        message: input,
      });

      const botReply = res.data.reply || "No response received.";
      
      // Small delay before showing bot response for better UX
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { role: "bot", content: botReply, timestamp: getTime() },
        ]);
      }, 500);
    } catch (err: any) {
      // Log only in development
      if (import.meta.env.DEV) {
        console.error("Chat Error:", err.response?.data || err.message);
      }
      
      // Small delay before showing error message for consistency
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: "⚠️ Something went wrong.",
            timestamp: getTime(),
          },
        ]);
      }, 500);
    } finally {
      setIsTyping(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Career Chat Transcript", 20, 20);
    let y = 30;

    messages.forEach((msg) => {
      const line = `${msg.timestamp} [${msg.role === "user" ? "You" : "Bot"}]: ${msg.content}`;
      const splitLines = doc.splitTextToSize(line, 180);
      doc.text(splitLines, 20, y);
      y += splitLines.length * 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("career_chat.pdf");
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 text-gray-900 dark:text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-indigo-700 dark:text-yellow-400 mb-8"
      >
        Career Guidance Chatbot
      </motion.h1>      <div className="max-w-4xl mx-auto flex flex-col h-[75vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 overflow-hidden">        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full mr-2">
                  🤖
                </div>
              )}

              <div>
                <p
                  className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white dark:bg-yellow-500 dark:text-black"
                      : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {msg.content}
                </p>
                <p
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-blue-300 text-black flex items-center justify-center rounded-full ml-2">
                  🙋
                </div>
              )}
            </div>
          ))}          {isTyping && (
            <div className="flex items-center justify-start">
              <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full mr-2">
                🤖
              </div>
              <p className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg animate-pulse">
                Typing...
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
          <div className="flex flex-1 items-center w-full">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-900"
              placeholder="Ask me anything about your career..."
            />
            <button
              onClick={sendMessage}
              className="ml-3 bg-indigo-600 dark:bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-yellow-600 transition"
            >
              Send
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              📄 Download PDF
            </button>
            <button
              onClick={clearChat}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              🗑️ Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerChat;
