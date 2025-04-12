
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    if (!referralCode) return [];
    
    // Use standardized code for searching
    const storageCode = standardizeReferralCode(referralCode);
    
    debugLog("referralService", "Searching for referral code:", storageCode);
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", storageCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds = querySnapshot.docs.map(doc => doc.id);
      
      debugLog("referralService", `Found ${userIds.length} users with referral code:`, storageCode);
      return userIds;
    }
    
    debugLog("referralService", "No users found with referral code:", storageCode);
    return [];
  } catch (error) {
    errorLog("referralService", "Error finding users by referral code:", error);
    return [];
  }
}
