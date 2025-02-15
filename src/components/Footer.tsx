import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Kickstart</h3>
            <p className="text-gray-400">Empowering careers through AI-driven guidance and blockchain security.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-indigo-400">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-indigo-400">About</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-indigo-400">Services</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400">Contact</Link></li>
            </ul>
          </div>

          {/* Sponsorship & Partnerships */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Collaborate With Us</h3>
            <p className="text-gray-400 mb-2">For sponsorships & partnerships:</p>
            <p className="text-indigo-400 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <a href="mailto:sponsor@kickstart.com" className="hover:underline">sponsor@kickstart.com</a>
            </p>
          </div>
        </div>

        {/* Stay Updated Section */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-4">Subscribe for updates on career insights and new features.</p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-64 rounded-l-lg bg-gray-700 text-white focus:outline-none"
            />
            <button className="bg-indigo-500 px-4 py-2 rounded-r-lg text-white hover:bg-indigo-600 transition">Subscribe</button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Github className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            © 2024 Kickstart. All rights reserved. Under the guidance of Prof. Somen Hati.
          </p>
        </div>
      </div>
    </footer>
  );
}
