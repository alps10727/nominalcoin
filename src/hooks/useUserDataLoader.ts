
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
 * 
 * Features:
 * - Advanced caching
 * - Automatic retry
 * - Error isolation
 * - Smart synchronization
 * - Suspicious data detection
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
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string | null>(null);

  const { loadLocalUserData, ensureReferralData, createDefaultUserData } = useLocalDataLoader();
  const { loadSupabaseUserData, mergeUserData } = useSupabaseDataLoader();
  const { ensureValidUserData } = useUserDataValidator();

  // Main function to load user data
  const loadUserData = useCallback(async () => {
    if (!authInitialized) return;
    
    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      setDataSource(null);
      return;
    }

    // Clear data when user changes
    if (lastLoadedUserId && lastLoadedUserId !== currentUser.id) {
      debugLog("useUserDataLoader", "User changed, clearing data", 
        { lastUser: lastLoadedUserId, newUser: currentUser.id });
      clearUserData();
      QueryCacheManager.invalidate(new RegExp(`^userData_${lastLoadedUserId}`));
      setUserData(null);
    }
    
    // Save current user ID
    setLastLoadedUserId(currentUser.id);

    try {
      // Load local data for current user
      let localData = loadLocalUserData();
      
      // Check for different user
      if (localData && localData.userId && localData.userId !== currentUser.id) {
        debugLog("useUserDataLoader", "Local data belongs to different user, clearing", 
          { storedId: localData.userId, currentId: currentUser.id });
        clearUserData();
        localData = null;
      }
      
      // Check and create referral code if needed
      localData = ensureReferralData(localData, currentUser.id);
      
      if (localData) {
        // Temporarily use local data for speed
        setUserData(localData);
        setDataSource('local');
        debugLog("useUserDataLoader", "Loaded data from local storage:", localData);
      }
      
      try {
        // Try loading data from Supabase
        const { data: supabaseData, source } = await loadSupabaseUserData(currentUser.id);
        
        if (source === 'supabase' || source === 'cache') {
          debugLog("useUserDataLoader", `Data loaded from ${source} source:`, supabaseData);
          
          if (supabaseData) {
            // Compare local and Supabase data and do smart merge
            // This will detect manipulated localStorage data
            const mergedData = mergeUserData(localData, supabaseData);
            const validatedData = ensureValidUserData(mergedData, currentUser.id);
            
            // Show notification if there's a discrepancy between Firebase and local storage
            if (localData && Math.abs(localData.balance - supabaseData.balance) > 0.1) {
              if (localData.balance > supabaseData.balance * 1.2) { // >20% difference is suspicious
                toast.warning("Account balance discrepancy detected. Using correct value.");
                debugLog("useUserDataLoader", "Suspicious balance difference detected", 
                  { local: localData.balance, server: supabaseData.balance });
              }
            }
            
            setUserData(validatedData);
            setDataSource(source);
            saveUserData(validatedData, currentUser.id);
          }
        } else if (source === 'timeout' && !localData) {
          // Couldn't access Supabase and no local data, create new data
          const emptyData = createDefaultUserData(currentUser.id);
          setUserData(emptyData);
          saveUserData(emptyData, currentUser.id);
          setDataSource('local');
          
          toast.warning("Your user data was not found. A new profile has been created.");
        }
      } catch (error) {
        handleSupabaseConnectionError(error, "useUserDataLoader");
        
        if (!localData) {
          const emptyData = createDefaultUserData(currentUser.id);
          setUserData(emptyData);
          saveUserData(emptyData, currentUser.id);
          setDataSource('local');
        }
      }
      
      setLoading(false);
    } catch (error) {
      errorLog("useUserDataLoader", "Critical error loading user data:", error);
      
      const emptyData = createDefaultUserData(currentUser?.id);
      
      setUserData(emptyData);
      saveUserData(emptyData, currentUser?.id);
      setDataSource('local');
      setLoading(false);
      
      toast.error("Error loading data. Please try again.");
    }
  }, [currentUser, authInitialized, errorOccurred, loadAttempt, lastLoadedUserId]);

  // Start loading
  useEffect(() => {
    let isActive = true;
    
    const initializeData = async () => {
      await loadUserData();
      if (!isActive) return;
    };
    
    initializeData();
    
    // Periodic revalidation (every 5 minutes)
    const refreshInterval = setInterval(() => {
      if (currentUser) {
        // Just update cache with server data in background
        // This happens without freezing UI
        loadSupabaseUserData(currentUser.id)
          .then(({ data, source }) => {
            if (data && (source === 'supabase' || source === 'cache')) {
              // Update local data if server has higher balance
              setUserData(current => {
                if (!current) return data;
                
                if (data.balance > current.balance) {
                  debugLog("useUserDataLoader", "Higher balance detected on server, updating", {
                    currentBalance: current.balance,
                    serverBalance: data.balance
                  });
                  
                  const updatedData = {
                    ...current,
                    balance: data.balance
                  };
                  
                  saveUserData(updatedData, currentUser.id);
                  return updatedData;
                }
                
                return current;
              });
            }
          });
      }
    }, 300000); // 5 minutes
    
    return () => {
      isActive = false;
      clearInterval(refreshInterval);
    };
  }, [loadUserData, currentUser]);

  return { userData, loading, dataSource };
}
