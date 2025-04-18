
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { handleSupabaseConnectionError } from "@/utils/supabaseErrorHandler";
import { QueryCacheManager } from "@/services/db";
import { UserData, saveUserData, clearUserData } from "@/utils/storage";
import { useLocalDataLoader } from "@/hooks/user/useLocalDataLoader";
import { useSupabaseLoader } from "@/hooks/user/useSupabaseLoader";
import { useUserDataValidator } from "@/hooks/user/useUserDataValidator";

export interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  dataSource: 'supabase' | 'cache' | 'local' | null;
}

/**
 * Optimized data loading hook for millions of users
 */
export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'cache' | 'local' | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { loadLocalUserData, ensureReferralData, createDefaultUserData } = useLocalDataLoader();
  const { loadSupabaseUserData } = useSupabaseLoader();
  const { ensureValidUserData } = useUserDataValidator();

  // Reset state when user changes
  useEffect(() => {
    if (authInitialized && currentUser?.id !== currentUserId) {
      if (currentUserId) {
        debugLog("useUserDataLoader", "User changed, clearing old data", 
          { lastUser: currentUserId, newUser: currentUser?.id });
          
        // Clear data when user changes
        setUserData(null);
        setDataSource(null);
        
        // Clear EVERYTHING in localStorage related to the previous user
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('fcMinerUserData') || 
            key === 'userReferralCode' ||
            key.includes('supabase.auth')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      // Update current user ID
      setCurrentUserId(currentUser?.id || null);
      
      // Trigger reload of user data
      setLoadAttempt(prev => prev + 1);
      
      // Clear cache for previous user
      if (currentUserId) {
        QueryCacheManager.invalidate(new RegExp(`^userData_${currentUserId}`));
      }
    }
  }, [currentUser, currentUserId, authInitialized]);

  // Main function to load user data
  const loadUserData = useCallback(async () => {
    if (!authInitialized) return;
    
    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      setDataSource(null);
      return;
    }

    // Save current user ID
    setCurrentUserId(currentUser.id);

    try {
      // Clear localStorage if we detect a user that's different from currentUser
      const localData = loadLocalUserData();
      if (localData && localData.userId && localData.userId !== currentUser.id) {
        debugLog("useUserDataLoader", "Local data belongs to different user, clearing", 
          { storedId: localData.userId, currentId: currentUser.id });
        clearUserData(true); // Clear ALL user data
      }
      
      // Start fresh - No local data
      setLoading(true);
      
      try {
        // Try loading data from Supabase
        const { data: supabaseData, source } = await loadSupabaseUserData(currentUser.id);
        
        if (source === 'supabase' || source === 'cache') {
          debugLog("useUserDataLoader", `Data loaded from ${source} source:`, supabaseData);
          
          if (supabaseData) {
            // Ensure we have a valid referral code
            const validatedData = ensureReferralData(supabaseData, currentUser.id);
            const finalData = ensureValidUserData(validatedData, currentUser.id);
            
            // Update state with fetched data
            setUserData(finalData);
            setDataSource(source);
            saveUserData(finalData, currentUser.id);
          } else {
            // No data found in Supabase, create default data
            const emptyData = createDefaultUserData(currentUser.id);
            setUserData(emptyData);
            saveUserData(emptyData, currentUser.id);
            setDataSource('local');
          }
        } else if (source === 'timeout') {
          // Couldn't access Supabase, create new data
          const emptyData = createDefaultUserData(currentUser.id);
          setUserData(emptyData);
          saveUserData(emptyData, currentUser.id);
          setDataSource('local');
          
          toast.warning("Sunucu verilerinize erişilemedi. Yerel veriler kullanılıyor.");
        }
      } catch (error) {
        handleSupabaseConnectionError(error, "useUserDataLoader");
        
        // Create default data if we couldn't get from Supabase
        const emptyData = createDefaultUserData(currentUser.id);
        setUserData(emptyData);
        saveUserData(emptyData, currentUser.id);
        setDataSource('local');
      }
      
      setLoading(false);
    } catch (error) {
      errorLog("useUserDataLoader", "Critical error loading user data:", error);
      
      const emptyData = createDefaultUserData(currentUser?.id || "unknown");
      
      setUserData(emptyData);
      saveUserData(emptyData, currentUser?.id);
      setDataSource('local');
      setLoading(false);
      
      toast.error("Kullanıcı verileri yüklenirken bir hata oluştu.");
    }
  }, [currentUser, authInitialized, errorOccurred, loadAttempt]);

  // Start loading
  useEffect(() => {
    let isActive = true;
    
    const initializeData = async () => {
      await loadUserData();
      if (!isActive) return;
    };
    
    initializeData();
    
    // Periodic revalidation (every 5 minutes) - reduced frequency
    const refreshInterval = setInterval(() => {
      if (currentUser && navigator.onLine) {
        // Just update cache with server data in background
        loadSupabaseUserData(currentUser.id)
          .then(({ data, source }) => {
            if (!isActive) return;
            
            if (data && (source === 'supabase' || source === 'cache')) {
              // Update with server data if different
              setUserData(current => {
                if (!current) return data;
                
                // Only update if there are meaningful differences
                if (data.balance !== current.balance ||
                    data.referralCount !== current.referralCount ||
                    data.name !== current.name) {
                  
                  debugLog("useUserDataLoader", "Detected changes from server, updating local data");
                  
                  const updatedData = {
                    ...current,
                    balance: data.balance,
                    referralCount: data.referralCount || current.referralCount,
                    referrals: data.referrals || current.referrals,
                    invitedBy: data.invitedBy || current.invitedBy,
                    name: data.name || current.name
                  };
                  
                  saveUserData(updatedData, currentUser.id);
                  return updatedData;
                }
                
                return current;
              });
            }
          })
          .catch(() => {
            // Silent fail on background refresh
          });
      }
    }, 300000); // 5 minutes
    
    return () => {
      isActive = false;
      clearInterval(refreshInterval);
    };
  }, [loadUserData, currentUser, loadAttempt]);

  return { userData, loading, dataSource };
}
