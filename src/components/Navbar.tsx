import React, { useState, useEffect, useRef } from "react";
import { Menu, User, LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("/default-avatar.png");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user?.profilePic) {
      setProfilePicUrl(`http://localhost:5000${user.profilePic}?t=${new Date().getTime()}`);
    }
  }, [user?.profilePic]);

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold dark:text-yellow-300"
      : "text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-yellow-300";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-yellow-300">
            Kickstart
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive("/")}>Home</Link>
            <Link to="/about" className={isActive("/about")}>About</Link>
            <Link to="/services" className={isActive("/services")}>Services</Link>
            <Link to="/career-chat" className={isActive("/career-chat")}>Career Chat</Link>
            <Link to="/contact" className={isActive("/contact")}>Contact</Link>
           
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hidden md:inline-block px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm dark:text-white transition-all"
              title="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {/* User Dropdown or Login */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    {user?.profilePic ? (
                      <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M16 20v-2a4 4 0 0 0-8 0v2" />
                        </svg>
                      </span>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-white hover:bg-indigo-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="h-5 w-5 mr-2" /> Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-3 text-gray-700 dark:text-white hover:bg-red-100 dark:hover:bg-red-700"
                      >
                        <LogOut className="h-5 w-5 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-block bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger - Mobile */}
            <motion.button
              className="md:hidden text-indigo-600 dark:text-yellow-300"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              whileTap={{ rotate: 180, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-64px)] w-3/4 max-w-xs bg-white dark:bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden shadow-lg border-l dark:border-gray-700 py-6 px-6 flex flex-col gap-4`}
      >
        <Link to="/" className={isActive("/")}>Home</Link>
        <Link to="/about" className={isActive("/about")}>About</Link>
        <Link to="/services" className={isActive("/services")}>Services</Link>
        <Link to="/contact" className={isActive("/contact")}>Contact</Link>
        <Link to="/career-chat" className={isActive("/career-chat")}>Career Chat</Link>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-3 py-2 mt-4 rounded-full bg-gray-200 dark:bg-gray-700 text-sm dark:text-white transition-all w-fit"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        {!user && (
          <Link
            to="/login"
            className="mt-2 w-fit self-start bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
