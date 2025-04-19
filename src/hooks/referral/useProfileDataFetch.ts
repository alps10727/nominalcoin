
import { supabase } from "@/integrations/supabase/client";
import { debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

interface ProfileData {
  referral_code: string | null;
  referral_count: number | null;
  referrals: string[] | null;
  balance: number | undefined;
  mining_rate: number | undefined;
}

export const useProfileDataFetch = () => {
  const fetchProfileData = async (userId: string): Promise<ProfileData | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referrals, balance, mining_rate')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      // Show error toast with a fixed ID to prevent duplicates
      toast.error("Verileri yüklerken bir hata oluştu", {
        id: "referral-error-toast",
      });
      debugLog("ProfileData", "Error fetching data:", error);
      return null;
    }
  };

  return { fetchProfileData };
};
