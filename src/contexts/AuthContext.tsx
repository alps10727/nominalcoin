
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js"; 
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUserDataManager } from "@/hooks/userData";
import { debugLog } from "@/utils/debugUtils";
import { UserData } from "@/utils/storage";
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
  dataSource: 'supabase' | 'cache' | 'local' | null; // Updated to only include valid values
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
        dataSource: null as ('supabase' | 'local' | null)
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
  
  // Set up realtime subscription for profile changes
  useEffect(() => {
    if (!currentUser) return;

    debugLog("AuthProvider", "Setting up realtime subscription for profile changes", { userId: currentUser.id });

    // Enable this table for realtime
    const setupRealtime = async () => {
      await supabase.rpc('enable_realtime_for_table', { table_name: 'profiles' }).catch(err => {
        console.warn("Error enabling realtime:", err);
      });
    };
    
    setupRealtime();
    
    // Subscribe to changes on user's profile
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
            // Update only specific fields from payload to preserve the rest of userData
            const updatedData: UserData = {
              ...userData,
              balance: payload.new.balance || userData.balance,
              miningRate: payload.new.mining_rate || userData.miningRate,
              referralCount: payload.new.referral_count || userData.referralCount,
              referrals: payload.new.referrals || userData.referrals,
              invitedBy: payload.new.invited_by || userData.invitedBy
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
