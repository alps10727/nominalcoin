
import { useEffect } from "react";
import { useReferralData } from "@/hooks/referral/useReferralData";
import { useReferralCode } from "@/hooks/referral/useReferralCode";
import { useAuth } from "@/contexts/AuthContext";
import ReferralHeader from "./ReferralHeader";
import ReferralStats from "./ReferralStats";
import ReferralCodeCard from "./ReferralCodeCard";
import ReferralBenefits from "./ReferralBenefits";
import ReferralList from "./ReferralList";
import LoadingState from "./LoadingState";

const ReferralContainer = () => {
  const { currentUser } = useAuth();
  const {
    isLoading,
    isRefreshing,
    referralCode,
    referralCount,
    referrals,
    refreshUserData,
    setReferralCode
  } = useReferralData();

  useReferralCode(currentUser, setReferralCode);

  // Set up auto-refresh timer
  useEffect(() => {
    if (!currentUser) return;
    
    // Refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      refreshUserData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [currentUser, refreshUserData]);

  // Initial data load
  useEffect(() => {
    if (currentUser && currentUser.id) {
      refreshUserData();
    }
  }, [currentUser?.id, refreshUserData]);

  if (isLoading && !referralCode) {
    return <LoadingState />;
  }

  return (
    <div className="container max-w-md px-4 py-8 mx-auto space-y-6">
      <ReferralHeader onRefresh={refreshUserData} isRefreshing={isRefreshing} />
      <ReferralStats referralCount={referralCount} />
      <ReferralCodeCard referralCode={referralCode} />
      <ReferralBenefits />
      <ReferralList referrals={referrals} />
    </div>
  );
};

export default ReferralContainer;
