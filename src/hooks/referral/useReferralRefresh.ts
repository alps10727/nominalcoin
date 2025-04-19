
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export const useReferralRefresh = (
  currentUser: any,
  setIsRefreshing: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  referralCode: string,
  setReferralCode: (code: string) => void,
) => {
  const { userData, updateUserData } = useAuth();

  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshing(true);
      toast("Referans bilgileri yükleniyor...");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referrals, balance, mining_rate')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        if (updateUserData && userData) {
          const newCode = data.referral_code || referralCode;
          
          if (newCode) {
            localStorage.setItem('userReferralCode', newCode);
            setReferralCode(newCode);
          }
          
          await updateUserData({
            ...userData,
            referralCode: newCode,
            referralCount: data.referral_count || 0,
            referrals: data.referrals || [],
            balance: data.balance !== undefined ? data.balance : userData.balance,
            miningRate: data.mining_rate !== undefined ? data.mining_rate : userData.miningRate
          });
          
          toast("Referans bilgileri güncellendi");
        }
      }
    } catch (error) {
      toast.error("Verileri güncellerken bir hata oluştu");
      debugLog("Referral", "Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  return { refreshUserData };
};
