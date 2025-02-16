import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  college?: string;
  branch?: string;
  year?: string;
  enrollment?: string;
  bio?: string;
  skills?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  phone?: string;
  projects?: string;
  internships?: string;
  certifications?: string;
  achievements?: string;
  interests?: string;
  hobbies?: string;
}

// Define the AuthContext type (no setUser here)
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    updatedData: Partial<User>,
    profilePic?: File,
    resume?: File
  ) => Promise<{ success: boolean; error?: string }>;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch the authenticated user's data
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch {
      setUser(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  };

  // Fetch user data on initial render
  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Update Profile function
  const updateProfile = async (
    updatedData: Partial<User>,
    profilePic?: File,
    resume?: File
  ) => {
    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (profilePic) formData.append("profilePic", profilePic);
      if (resume) formData.append("resume", resume);

      await axios.put("http://localhost:5000/api/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Re-fetch updated user data
      await fetchUser();

      return { success: true };
    } catch (error) {
      console.error("Profile update failed", error);
      return {
        success: false,
        error: (axios.isAxiosError(error) && error.response?.data) || "Something went wrong",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
