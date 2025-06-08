import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

import './index.css';
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext"; // ✅ Import ChatProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider> {/* ✅ Wrap App with ChatProvider */}
          <App />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
