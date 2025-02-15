import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export function Profile() {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    college: "",
    branch: "",
    year: "",
    enrollment: "",
    resume: null as File | null,
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    phone: "",
    projects: "",
    internships: "",
    certifications: "",
    achievements: "",
    interests: "",
    hobbies: "",
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      if (e.target.name === "resume") {
        setProfileData({ ...profileData, resume: e.target.files[0] });
      } else {
        setProfilePic(e.target.files[0]);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(profileData).forEach(([key, value]) => {
      if (value) {
        if (value instanceof File) {
          formData.append(key, value); // Handle file uploads correctly
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const res = await axios.put("http://localhost:5000/api/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      login(res.data.email, ""); // Refresh user info
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Update failed:", error.response?.data || error.message);
      } else {
        console.error("Update failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 backdrop-blur-lg"
      >
        <h2 className="text-4xl font-extrabold text-indigo-600 mb-6 text-center">User Profile</h2>
        
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.profilePic ? `http://localhost:5000${user.profilePic}` : "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md mb-3"
          />
          <input type="file" accept="image/*" name="profilePic" onChange={handleFileChange} className="border p-2 rounded" />
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(profileData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="block text-gray-700 capitalize">{key.replace(/_/g, " ")}</label>
              {key === "bio" ? (
                <textarea
                  name={key}
                  value={profileData[key as keyof typeof profileData] as string}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border rounded"
                />
              ) : key === "resume" ? (
                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full p-3 border rounded" />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={profileData[key as keyof typeof profileData] as string}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              )}
            </div>
          ))}
          
          <button
            type="submit"
            className="w-full col-span-1 md:col-span-2 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Update Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
}
