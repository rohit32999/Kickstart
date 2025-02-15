import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string; // Profile picture field
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>, profilePic?: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
      setUser(res.data);
      window.location.href = "/"; // Redirect to home after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateProfile = async (updatedData: Partial<User>, profilePic?: File) => {
    try {
      const formData = new FormData();
      if (updatedData.name) formData.append("name", updatedData.name);
      if (updatedData.email) formData.append("email", updatedData.email);
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await axios.put("http://localhost:5000/api/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data); // Update user state with new profile info
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
