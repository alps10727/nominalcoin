
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";

export const useUserDataUpdate = () => {
  const updateProfileData = async (
    userData: UserData | null,
    updateUserData: ((data: Partial<UserData>) => Promise<void>) | undefined,
    newData: {
      referralCode: string;
      referralCount: number;
      referrals: string[];
      balance?: number;
      miningRate?: number;
    }
  ) => {
    if (!updateUserData || !userData) return false;

    try {
      await updateUserData({
        ...userData,
        referralCode: newData.referralCode,
        referralCount: newData.referralCount,
        referrals: newData.referrals,
        balance: newData.balance !== undefined ? newData.balance : userData.balance,
        miningRate: newData.miningRate !== undefined ? newData.miningRate : userData.miningRate
      });
      return true;
    } catch (error) {
      debugLog("UserData", "Error updating data:", error);
      return false;
    }
  };

  return { updateProfileData };
};
