
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/userData";
import { debugLog } from "@/utils/debugUtils";
import { UserData, clearUserData } from "@/utils/storage";
import { AuthContext } from "./AuthContext";
import { useProfileRealtime } from "@/hooks/auth/useProfileRealtime";
import { useUserDataCleanup } from "@/hooks/auth/useUserDataCleanup";
import { useInitialUserData } from "@/hooks/auth/useInitialUserData";
import { useReferralRecovery } from "@/hooks/auth/useReferralRecovery";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = (() => {
    try {
      return useAuthState();
    } catch (err) {
      console.error("AuthState loading error:", err);
      return {
        currentUser: null,
        userData: null,
        loading: true,
        isOffline: true,
        dataSource: null as ('supabase' | 'local' | 'cache' | null)
      };
    }
  })();
  
  const { currentUser, userData: initialUserData, loading, isOffline, dataSource } = authState;
  
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Use the extracted hooks
  useUserDataCleanup(currentUser, userId, setUserId, setUserData);
  useInitialUserData(initialUserData, setUserData);
  useProfileRealtime(currentUser, userData, setUserData);
  
  const { login, logout: baseLogout, register } = (() => {
    try {
      return useAuthActions();
    } catch (err) {
      console.error("AuthActions loading error:", err);
      return {
        login: async () => false,
        logout: async () => {},
        register: async () => false
      };
    }
  })();
  
  const logout = async () => {
    debugLog("AuthContext", "Enhanced logout function called");
    
    setUserData(null);
    
    try {
      clearUserData(true);
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('fcMinerUserData') || 
          key === 'userReferralCode' ||
          key.includes('supabase') ||
          key.includes('sb-')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          debugLog("AuthContext", `Removed item: ${key}`);
        } catch (e) {
          // Ignore errors
        }
      });
      
      await baseLogout();
      
      localStorage.removeItem('supabase.auth.token');
      
    } catch (err) {
      console.error("AuthContext", "Logout error:", err);
      
      try {
        clearUserData(true);
        localStorage.removeItem('supabase.auth.token');
      } catch (e) {
        // Ignore errors
      }
      
      throw err;
    }
  };
  
  const { updateUserData } = (() => {
    try {
      return useUserDataManager(currentUser, userData, setUserData);
    } catch (err) {
      console.error("UserDataManager loading error:", err);
      return {
        updateUserData: async () => {}
      };
    }
  })();
  
  // Use the referral recovery hook to fix missing referral data
  useReferralRecovery(currentUser, userData, updateUserData);

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

  debugLog("AuthProvider", "AuthProvider loaded, user:", currentUser?.email || "None");

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
