import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

// Define the AuthContext type (add loading here)
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    updatedData: Partial<User>,
    profilePic?: File,
    resume?: File
  ) => Promise<{ success: boolean; error?: string }>;
  loading: boolean; // <-- Add this line
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the authenticated user's data
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on initial render
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {      await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      await fetchUser();
      // Use client-side navigation instead of window.location.href
      // window.location.href = "/";
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      // Use client-side navigation instead of window.location.href
      // window.location.href = "/login";
      navigate("/login");
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

      await axios.put(`${API_BASE_URL}/api/user/update`, formData, {
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

  // Only redirect to login if not loading and user is null, and not already on login page
  useEffect(() => {
    if (!loading && user === null && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, [loading, user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center transition-colors duration-500 bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-yellow-400 transition-colors duration-500"></div>
            <span className="mt-6 text-lg font-semibold text-indigo-700 dark:text-yellow-400 transition-colors duration-500">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="transition-opacity duration-700 opacity-100">{children}</div>
      )}
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
