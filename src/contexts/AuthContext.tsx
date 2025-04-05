import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/useUserDataManager";
import { debugLog } from "@/utils/debugUtils";
import { UserData } from "@/utils/storage";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  userData: UserData | null;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isOffline: boolean;
  dataSource: 'firebase' | 'local' | null;
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
  const { currentUser, userData: initialUserData, loading, isOffline, dataSource } = useAuthState();
  
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  
  useEffect(() => {
    if (initialUserData) {
      debugLog("AuthProvider", "initialUserData değişti, userData güncelleniyor", initialUserData);
      setUserData(initialUserData);
    }
  }, [initialUserData]);
  
  const { login, logout, register } = useAuthActions();
  
  const { updateUserData } = useUserDataManager(currentUser, userData, setUserData);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    userData,
    updateUserData,
    isOffline,
    dataSource
  };

  debugLog("AuthProvider", "AuthProvider yüklendi, kullanıcı:", currentUser?.email || "Yok");

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
