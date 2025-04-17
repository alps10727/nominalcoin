
import React, { useContext, useState, createContext, ReactNode } from "react";

// Mock user data
interface UserData {
  balance: number;
  miningRate: number;
  lastSaved?: number;
  miningActive?: boolean;
  miningTime?: number;
  miningPeriod?: number;
  poolMembership?: {
    currentPool?: string;
  };
  miningStats?: {
    rank?: string;
    totalDays?: number;
  };
  name?: string;
}

interface AuthContextType {
  currentUser: any;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: object) => Promise<boolean>;
  updateUserData: (updates: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>({
    balance: 100,
    miningRate: 0.003,
    lastSaved: Date.now(),
    miningStats: {
      rank: "Rookie",
      totalDays: 5
    },
    name: "Demo User"
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Mock login for", email);
      const user = { uid: "user123", email };
      setCurrentUser(user);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log("Mock logout");
      setCurrentUser(null);
      setUserData(null);
      setLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, userData: any = {}) => {
    setLoading(true);
    try {
      console.log("Mock register for", email);
      const user = { uid: "new-user-" + Date.now(), email };
      setCurrentUser(user);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      setLoading(false);
      return false;
    }
  };

  const updateUserData = async (updates: Partial<UserData>) => {
    try {
      setUserData(prev => {
        if (!prev) return updates as UserData;
        return { ...prev, ...updates };
      });
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    isOffline: false,
    login,
    logout,
    register,
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
