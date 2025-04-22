
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { debugLog } from "@/utils/debugUtils";
import { clearUserData } from "@/utils/storage";
import { UserData } from "@/utils/storage";

export function useUserDataCleanup(
  currentUser: User | null,
  userId: string | null,
  setUserId: (id: string | null) => void,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  useEffect(() => {
    if (currentUser?.id !== userId) {
      if (userId) {
        debugLog("useUserDataCleanup", "User changed, clearing old data", 
          { lastUser: userId, newUser: currentUser?.id });
          
        setUserData(null);
        
        if (userId !== currentUser?.id) {
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
      
      setUserId(currentUser?.id || null);
    }
  }, [currentUser, userId, setUserId, setUserData]);
}
