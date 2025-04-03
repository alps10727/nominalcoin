
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/useUserDataManager";
import { debugLog } from "@/utils/debugUtils";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  userData: any | null;
  updateUserData: (data: any) => Promise<void>;
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
  // Kimlik doğrulama durumunu al
  const { currentUser, userData: initialUserData, loading, isOffline, dataSource } = useAuthState();
  
  // Kullanıcı veri durumunu yönet
  const [userData, setUserData] = useState<any | null>(initialUserData);
  
  // initialUserData değiştiğinde userData'yı güncelle
  useEffect(() => {
    if (initialUserData) {
      debugLog("AuthProvider", "initialUserData değişti, userData güncelleniyor", initialUserData);
      setUserData(initialUserData);
    }
  }, [initialUserData]);
  
  // Kimlik doğrulama eylemlerini al
  const { login, logout, register } = useAuthActions();
  
  // Kullanıcı veri yönetimi fonksiyonlarını al
  const { updateUserData } = useUserDataManager(currentUser, userData, setUserData);

  // Context değerini oluştur
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
