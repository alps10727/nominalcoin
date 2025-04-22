
import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/userData";
import { debugLog } from "@/utils/debugUtils";
import { UserData, clearUserData } from "@/utils/storage";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";

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
      debugLog("AuthProvider", "User changed, resetting user data cache", 
        { previous: userId, current: currentUser?.id });
      
      setUserId(currentUser?.id || null);
      setUserData(null);
      
      if (userId && userId !== currentUser?.id) {
        clearUserData(true);
        
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('fcMinerUserData') || 
            key === 'userReferralCode' ||
            (key.includes('supabase.auth') && !currentUser)
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
  
  useEffect(() => {
    if (!currentUser) return;

    debugLog("AuthProvider", "Setting up realtime subscription for profile changes", { userId: currentUser.id });

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
