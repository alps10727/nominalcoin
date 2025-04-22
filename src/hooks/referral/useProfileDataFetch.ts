
import { fetchProfileData } from "@/services/api/shared";

interface ProfileData {
  referral_code: string | null;
  referral_count: number | null;
  referrals: string[] | null;
  balance: number | undefined;
  mining_rate: number | undefined;
}

export const useProfileDataFetch = () => {
  const fetchProfileDataHook = async (userId: string): Promise<ProfileData | null> => {
    return await fetchProfileData(userId);
  };

  return { fetchProfileData: fetchProfileDataHook };
};

