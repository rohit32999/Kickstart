import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: "",
    enrollment: "",
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
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        college: user.college || "",
        branch: user.branch || "",
        year: user.year || "",
        enrollment: user.enrollment || "",
        bio: user.bio || "",
        skills: user.skills || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        portfolio: user.portfolio || "",
        phone: user.phone || "",
        projects: user.projects || "",
        internships: user.internships || "",
        certifications: user.certifications || "",
        achievements: user.achievements || "",
        interests: user.interests || "",
        hobbies: user.hobbies || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      if (e.target.name === "profilePic") {
        setProfilePic(e.target.files[0]);
      } else if (e.target.name === "resume") {
        setResume(e.target.files[0]);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text fields to FormData
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append files to FormData
    if (profilePic) formData.append("profilePic", profilePic);
    if (resume) formData.append("resume", resume);

    try {
      const res = await axios.put("http://localhost:5000/api/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.user) {
        updateProfile(res.data.user); // Update user context
        setMessage("Profile updated successfully!");
      } else {
        console.error("Update failed: No user data returned.");
      }
    } catch (error) {
      console.error("Update failed:", error);
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

        {message && <div className="text-green-600 text-center mb-4">{message}</div>}

        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-300 shadow-lg">
            <img
              src={user?.profilePic ? `http://localhost:5000${user.profilePic}` : "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="block text-gray-700 mt-4 font-medium">Update Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            name="profilePic"
            onChange={handleFileChange}
            className="border p-2 rounded mt-2"
          />
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(profileData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="block text-gray-700 capitalize">{key.replace(/_/g, " ")}</label>
              <input
                type="text"
                name={key}
                value={profileData[key as keyof typeof profileData] as string}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:ring-indigo-500"
              />
            </div>
          ))}

          {/* Resume Upload */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-medium">Upload Resume:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              name="resume"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>

          {/* Submit Button */}
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
