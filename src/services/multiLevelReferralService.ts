
export async function rewardDirectReferrer(newUserId: string): Promise<void> {
  try {
    if (!newUserId) {
      debugLog("referralService", "Invalid user ID");
      return;
    }
    
    const directReferrerId = await getDirectReferrer(newUserId);
    
    if (!directReferrerId) {
      debugLog("referralService", "No direct referrer found for user:", newUserId);
      return;
    }
    
    const hasExistingBonus = await hasExistingReferralBonus(directReferrerId, newUserId);
    if (hasExistingBonus) {
      debugLog("referralService", "Referral bonus already processed:", {
        referrerId: directReferrerId,
        newUserId
      });
      return;
    }
    
    // Ensure reward is processed
    await updateReferrerInfo(directReferrerId, newUserId);
    
    debugLog("referralService", `Processed referral bonus for referrer:`, directReferrerId);
  } catch (error) {
    errorLog("referralService", "Error processing referral bonus:", error);
  }
}
