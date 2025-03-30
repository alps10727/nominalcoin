
import React, { createContext, useContext, useState } from "react";
import { User } from "firebase/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/useUserDataManager";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  userData: any | null;
  updateUserData: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Get authentication state
  const { currentUser, userData: initialUserData, loading } = useAuthState();
  
  // Manage user data state
  const [userData, setUserData] = useState<any | null>(initialUserData);
  
  // Update userData when initialUserData changes
  React.useEffect(() => {
    if (initialUserData) {
      setUserData(initialUserData);
    }
  }, [initialUserData]);
  
  // Get authentication actions
  const { login, logout, register } = useAuthActions();
  
  // Get user data management functions
  const { updateUserData } = useUserDataManager(currentUser, userData, setUserData);

  // Create the context value
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    userData,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
