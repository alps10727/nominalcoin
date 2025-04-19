
import { useState } from "react";
import { UserData } from "@/types/storage";

export const useReferralState = (userData: UserData | null) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>('');

  const referralCount = userData?.referralCount || 0;
  const referrals = userData?.referrals || [];

  return {
    isRefreshing,
    setIsRefreshing,
    isLoading,
    setIsLoading,
    referralCode,
    setReferralCode,
    referralCount,
    referrals,
  };
};
