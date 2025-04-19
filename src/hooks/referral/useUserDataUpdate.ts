
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

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
      
      // Use a fixed ID for the success toast to prevent duplicates
      toast("Referans bilgileri güncellendi", {
        id: "referral-update-success-toast",
        duration: 2000 // Shorter duration for better UX
      });
      return true;
    } catch (error) {
      debugLog("UserData", "Error updating data:", error);
      // Use a fixed ID for error toast to prevent duplicates
      toast.error("Verileri güncellerken bir hata oluştu", {
        id: "referral-update-error-toast",
        duration: 3000
      });
      return false;
    }
  };

  return { updateProfileData };
};
