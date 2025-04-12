
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
  dataSource: 'firebase' | 'cache' | 'local' | null;
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
  // Eğer AuthState yüklenmezse hata fırlatmayı önlemek için try-catch ekledik
  const authState = (() => {
    try {
      return useAuthState();
    } catch (err) {
      console.error("AuthState yüklenirken hata:", err);
      return {
        currentUser: null,
        userData: null,
        loading: true,
        isOffline: true,
        dataSource: null as ('firebase' | 'local' | null)
      };
    }
  })();
  
  const { currentUser, userData: initialUserData, loading, isOffline, dataSource } = authState;
  
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  
  useEffect(() => {
    if (initialUserData) {
      debugLog("AuthProvider", "initialUserData değişti, userData güncelleniyor", initialUserData);
      setUserData(initialUserData);
    }
  }, [initialUserData]);
  
  // AuthActions için de try-catch ekledik
  const { login, logout, register } = (() => {
    try {
      return useAuthActions();
    } catch (err) {
      console.error("AuthActions yüklenirken hata:", err);
      return {
        login: async () => false,
        logout: async () => {},
        register: async () => false
      };
    }
  })();
  
  // UserDataManager için de try-catch ekledik
  const { updateUserData } = (() => {
    try {
      return useUserDataManager(currentUser, userData, setUserData);
    } catch (err) {
      console.error("UserDataManager yüklenirken hata:", err);
      return {
        updateUserData: async () => {}
      };
    }
  })();

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
