
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useProfileDataFetch } from "./useProfileDataFetch";
import { useUserDataUpdate } from "./useUserDataUpdate";

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

  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshing(true);
      toast("Referans bilgileri yükleniyor...");
      
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
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  return { refreshUserData };
};
