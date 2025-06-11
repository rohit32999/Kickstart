import React, { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import EnhancedIQTest from "./pages/EnhancedIQTest";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Mission from "./pages/Mission";
import Vision from "./pages/Vision";
import { Profile } from "./pages/Profile";
import { Resources } from "./pages/Resources";
import { Certification } from "./pages/certification";
import CareerChat from "./pages/CareerChat";
import AICareerGuidance from "./pages/AICareerGuidance";
import CareerConfusionDemo from "./pages/CareerConfusionDemo";

const App: React.FC = () => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Come back and learn!";
      } else {
        document.title = defaultTitle.current;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />        <Route path="/about" element={<About />} />        <Route path="/services" element={<Services />} />        
        <Route path="/services/iq-test" element={<EnhancedIQTest />} />
        <Route path="/services/career-chat" element={<CareerChat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/IQTest" element={<EnhancedIQTest />} />
        <Route path="/iq-test-basic" element={<EnhancedIQTest />} />        <Route path="/resources" element={<Resources />} />
        <Route path="/certification" element={<Certification />} />
        <Route path="/AICareerGuidance" element={<AICareerGuidance />} />
        <Route path="/career-confusion-demo" element={<CareerConfusionDemo />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
