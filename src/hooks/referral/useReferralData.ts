
import { useAuth } from "@/contexts/AuthContext";
import { useReferralState } from "./useReferralState";
import { useReferralRefresh } from "./useReferralRefresh";

export const useReferralData = () => {
  const { userData, currentUser } = useAuth();
  const {
    isRefreshing,
    setIsRefreshing,
    isLoading,
    setIsLoading,
    referralCode,
    setReferralCode,
    referralCount,
    referrals,
  } = useReferralState(userData);

  const { refreshUserData } = useReferralRefresh(
    currentUser,
    setIsRefreshing,
    setIsLoading,
    referralCode,
    setReferralCode
  );

  return {
    isLoading,
    isRefreshing,
    referralCode,
    referralCount,
    referrals,
    refreshUserData,
    setReferralCode
  };
};
