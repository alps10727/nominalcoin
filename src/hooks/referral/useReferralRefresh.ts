
import { useAuth } from "@/contexts/AuthContext";
import { useProfileDataFetch } from "./useProfileDataFetch";
import { useUserDataUpdate } from "./useUserDataUpdate";
import { useState, useRef } from "react";

export const useReferralRefresh = (
  currentUser: any,
  setIsRefreshing: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  referralCode: string,
  setReferralCode: (code: string) => void,
) => {
  const { userData, updateUserData } = useAuth();
  const { fetchProfileData } = useProfileDataFetch();
  const { updateProfileData } = useUserDataUpdate();
  const [toastShown, setToastShown] = useState(false);
  const isRefreshingRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);

  const refreshUserData = async () => {
    if (!currentUser) return;
    
    // Prevent refresh if another refresh is in progress
    if (isRefreshingRef.current) return;
    
    // Add debouncing - prevent refresh if last refresh was less than 5 seconds ago
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 5000) return;
    lastRefreshTimeRef.current = now;
    
    try {
      // Mark as refreshing
      isRefreshingRef.current = true;
      setIsRefreshing(true);
      
      const profileData = await fetchProfileData(currentUser.id);
      
      if (profileData) {
        const newCode = profileData.referral_code || referralCode;
          
        if (newCode) {
          localStorage.setItem('userReferralCode', newCode);
          setReferralCode(newCode);
        }
        
        await updateProfileData(userData, updateUserData, {
          referralCode: newCode,
          referralCount: profileData.referral_count || 0,
          referrals: profileData.referrals || [],
          balance: profileData.balance,
          miningRate: profileData.mining_rate
        });
      }
      
      // Reset toast flag after successful refresh, with delay
      setTimeout(() => setToastShown(false), 3000);
    } catch (error) {
      console.error("Error in refreshUserData:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
      
      // Allow new refresh after a cooldown period
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 3000); // Longer cooldown to prevent rapid refreshes
    }
  };

  return { refreshUserData };
};
