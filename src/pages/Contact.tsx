import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from "framer-motion";

export function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-900">Get in <span className="text-indigo-600">Touch</span></h1>
        <p className="mt-5 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
          Have questions or need support? Reach out and we’ll respond as soon as possible.
        </p>
      </motion.div>

      <div className="mt-16 max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Contact Form */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative group bg-white/90 rounded-xl shadow-lg p-8 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <input type="text" placeholder="Name" className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              <input type="email" placeholder="Email" className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              <input type="text" placeholder="Subject" className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              <textarea placeholder="Message" rows={4} className="w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              <button type="submit" className="w-full bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-all">Send Message</button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative group bg-white/90 rounded-xl shadow-lg p-8 border border-gray-200 backdrop-blur-lg hover:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.05] hover:shadow-2xl"
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-5">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">Academy of Technology, Adisaptagram, Hooghly - 712121, West Bengal, India</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 (XXX) XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">contact@kickstart.edu.in</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Office Hours</h3>
                  <p className="text-gray-600">Mon - Fri: 9 AM - 5 PM | Sat: 9 AM - 1 PM | Sun: Closed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
