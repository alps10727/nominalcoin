
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; 
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/userData";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData, clearUserData } from "@/utils/storage";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  userData: UserData | null;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isOffline: boolean;
  dataSource: 'supabase' | 'cache' | 'local' | null;
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
        dataSource: null as ('supabase' | 'local' | 'cache' | null)
      };
    }
  })();
  
  const { currentUser, userData: initialUserData, loading, isOffline, dataSource } = authState;
  
  const [userData, setUserData] = useState<UserData | null>(initialUserData);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Update userData when initialUserData changes or user changes
  useEffect(() => {
    if (currentUser?.id !== userId) {
      // User has changed, reset userData
      debugLog("AuthProvider", "User changed, resetting user data cache", 
        { previous: userId, current: currentUser?.id });
      
      setUserId(currentUser?.id || null);
      setUserData(null);
      
      // Clear any cached data for previous user
      if (userId && userId !== currentUser?.id) {
        // Clear localStorage for previous user
        clearUserData(true);
        
        // Additional cleanup for any missed items
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('fcMinerUserData') || 
            key === 'userReferralCode' ||
            (key.includes('supabase.auth') && !currentUser) // Only clear auth if logging out
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    }
    
    if (initialUserData) {
      debugLog("AuthProvider", "initialUserData değişti, userData güncelleniyor", initialUserData);
      setUserData(initialUserData);
    }
  }, [initialUserData, currentUser, userId]);
  
  // Set up realtime subscription for profile changes
  useEffect(() => {
    if (!currentUser) return;

    debugLog("AuthProvider", "Setting up realtime subscription for profile changes", { userId: currentUser.id });

    // Enable realtime for profiles table if not already enabled
    const setupRealtime = async () => {
      try {
        await supabase.functions.invoke('enable_realtime', {
          body: { table: 'profiles' }
        }).catch(err => {
          console.warn("Error enabling realtime:", err);
        });
      } catch (error) {
        console.warn("Error enabling realtime:", error);
      }
    };
    
    setupRealtime();
    
    // Subscribe to profile changes for current user
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`
        },
        (payload) => {
          debugLog("AuthProvider", "Profile updated in realtime", payload.new);
          if (payload.new && userData) {
            const updatedData: UserData = {
              ...userData,
              balance: payload.new.balance || userData.balance,
              miningRate: payload.new.mining_rate || userData.miningRate,
              referralCount: payload.new.referral_count || userData.referralCount,
              referrals: payload.new.referrals || userData.referrals,
              invitedBy: payload.new.invited_by || userData.invitedBy,
              name: payload.new.name || userData.name
            };
            
            setUserData(updatedData);
          }
        }
      )
      .subscribe();
    
    return () => {
      debugLog("AuthProvider", "Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [currentUser, userData]);
  
  const { login, logout: baseLogout, register } = (() => {
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
  
  // Enhanced logout function that clears local user data
  const logout = async () => {
    debugLog("AuthContext", "Enhanced logout function called");
    
    // Clear user data before logging out
    setUserData(null);
    
    try {
      // Clear localStorage for this user
      clearUserData(true);
      
      // Additional cleanup for any missed items
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
      
      // Perform the actual logout
      await baseLogout();
      
      // Also force clear anything that might be leftover
      localStorage.removeItem('supabase.auth.token');
      
    } catch (err) {
      errorLog("AuthContext", "Logout error:", err);
      
      // Even if there's an error, try to clear localStorage
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
    logout, // Use our enhanced logout function
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
