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
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "error">("success"); // New state to track popup type

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

  const validateLinks = () => {
    const linkRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    const {linkedin, github, portfolio, projects } = profileData;
    if (github && !linkRegex.test(github)) {
      setMessage("Please provide a valid GitHub profile link.");
      setPopupType("error"); // Change popup type to error
      setShowPopup(true);
      return false;
    }
    if (linkedin && !linkRegex.test(linkedin)) {
      setMessage("Please provide a valid LinkedIn profile link.");
      setPopupType("error"); // Change popup type to error
      setShowPopup(true);
      return false;
    }
    if (portfolio && !linkRegex.test(portfolio)) {
      setMessage("Please provide a valid Portfolio link.");
      setPopupType("error");
      setShowPopup(true);
      return false;
    }
    if (projects && !linkRegex.test(projects)) {
      setMessage("Please provide a valid Project link.");
      setPopupType("error");
      setShowPopup(true);
      return false;
    }
    return true;
  };

  const validateFileType = () => {
    const allowedFormats = ["application/pdf"];
    if (resume && !allowedFormats.includes(resume.type)) {
      setMessage("Resume must be in PDF format.");
      setPopupType("error");
      setShowPopup(true);
      return false;
    }
    if (profilePic && !allowedFormats.includes(profilePic.type)) {
      setMessage("Profile picture must be in JPG, JPEG, or PNG format.");
      setPopupType("error");
      setShowPopup(true);
      return false;
    }
    return true;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // If email is blank, show a popup
    //if (!profileData.email) {
    //  setMessage("Email cannot be blank.");
    //  setPopupType("error");
    //  setShowPopup(true);
    //  return;
    //}

    // Check if email is being changed
    //if (user && profileData.email !== user.email) {
    //  setMessage("Email cannot be changed.");
    //  setPopupType("error");
    //  setShowPopup(true);
    //  return;
    //}

    // Validate links and file formats
    if (!validateLinks() || !validateFileType()) {
      return;
    }

    const formData = new FormData();

    // Append text fields to FormData
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append files to FormData, if they exist
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
        setPopupType("success"); // Set to success for a successful update
        setShowPopup(true);

        // Hide the popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
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

        {/* Popup for profile update success or errors */}
        {showPopup && (
          <div
            className={`absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 z-50 p-6 rounded-lg shadow-lg border ${
              popupType === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
            } max-w-md w-full`}
          >
            <p
              className={`text-center font-semibold ${
                popupType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          </div>
        )}

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
          <label
            htmlFor="profilePic"
            className="cursor-pointer bg-indigo-600 text-white p-3 rounded mt-2 inline-flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                d="M21 12H3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <path
                d="M12 21V3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            {profilePic ? "File Selected" : "Choose File"}
          </label>
          <input
            type="file"
            accept="image/*"
            name="profilePic"
            onChange={handleFileChange}
            id="profilePic"
            className="hidden"
          />
        </div>

        {/* Resume Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <label className="block text-gray-700 mt-4 font-medium">Upload Resume (Optional):</label>
          <label
            htmlFor="resume"
            className="cursor-pointer bg-indigo-600 text-white p-3 rounded mt-2 inline-flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                d="M21 12H3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
              <path
                d="M12 21V3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            {resume ? "File Selected" : "Choose File"}
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            name="resume"
            onChange={handleFileChange}
            id="resume"
            className="hidden"
          />
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(profileData).map((key) => (
            key !== 'email' && (
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
            )
          ))}

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
