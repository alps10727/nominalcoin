
import { useCallback, useEffect, useRef } from "react";
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
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshTimeRef = useRef(0);

  // Use useCallback with better debounce logic
  const handleRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 5000) return; // Prevent refresh if clicked within the last 5 seconds
    
    lastRefreshTimeRef.current = now;
    refreshUserData();
  }, [refreshUserData]);

  // Set up auto-refresh timer with much longer interval
  useEffect(() => {
    if (!currentUser) return;
    
    // Clear existing timeout if any
    if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
    }
    
    // Refresh only once every 5 minutes
    autoRefreshRef.current = setInterval(() => {
      // Only auto-refresh if not manually refreshed in the last minute
      const now = Date.now();
      if (now - lastRefreshTimeRef.current > 60000) {
        refreshUserData();
      }
    }, 300000); // 5 minutes
    
    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, [currentUser, refreshUserData]);

  // Initial data load - only once when component mounts
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
      <ReferralHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      <ReferralStats referralCount={referralCount} />
      <ReferralCodeCard referralCode={referralCode} />
      <ReferralBenefits />
      <ReferralList referrals={referrals} />
    </div>
  );
};

export default ReferralContainer;
