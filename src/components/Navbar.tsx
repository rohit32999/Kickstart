import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-600";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when navigating to another page
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Menu className="h-6 w-6 text-indigo-600 cursor-pointer md:hidden" />
            <Link to="/" className="text-2xl font-bold text-indigo-600">Kickstart</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive("/")}>Home</Link>
            <Link to="/about" className={isActive("/about")}>About</Link>
            <Link to="/services" className={isActive("/services")}>Services</Link>
            <Link to="/contact" className={isActive("/contact")}>Contact</Link>
          </div>

          {/* Profile Picture & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                {/* Profile Picture Button */}
                <button
                  className="flex items-center space-x-2 border p-2 rounded-full focus:outline-none"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <img
                    src={user.profilePic || "/default-avatar.png"} // Default image fallback
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                </button>

                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" /> Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="flex w-full items-center px-4 py-3 text-gray-700 hover:bg-red-100"
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
