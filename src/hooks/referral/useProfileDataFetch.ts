
import { supabase } from "@/integrations/supabase/client";
import { ProfileRow } from "@/types/supabase";

interface ProfileData {
  referral_code: string | null;
  referral_count: number | null;
  referrals: string[] | null;
  balance: number | undefined;
  mining_rate: number | undefined;
}

export const useProfileDataFetch = () => {
  const fetchProfileDataHook = async (userId: string): Promise<ProfileData | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referrals, balance, mining_rate')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        referral_code: data.referral_code || null,
        referral_count: data.referral_count || null,
        referrals: data.referrals || null,
        balance: data.balance,
        mining_rate: data.mining_rate
      };
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  };

  return { fetchProfileData: fetchProfileDataHook };
};
