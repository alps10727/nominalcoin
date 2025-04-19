
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
      
      // Clear any existing toasts with these IDs before showing new ones
      toast.dismiss("referral-loading-toast");
      toast.dismiss("referral-error-toast");
      toast.dismiss("referral-update-success-toast");
      toast.dismiss("referral-update-error-toast");
      
      // Only show toast on manual refresh (not on auto-refresh)
      if (!toastShown) {
        toast("Referans bilgileri yükleniyor...", {
          id: "referral-loading-toast",
          duration: 2000, // Even shorter duration
        });
        setToastShown(true);
      }
      
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
      // Show an error toast
      toast.error("Verileri yüklerken bir hata oluştu", {
        id: "refresh-error-toast", 
        duration: 3000
      });
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
