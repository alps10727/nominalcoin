
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MemberRank } from "@/types/pools";
import { UserData } from "@/types/storage";
import { getUserData } from "./poolHelpers";
import { errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Calculate mining rate with pool bonus
 */
export function calculateMiningRate(userData: UserData | null): number {
  if (!userData) return 0.003; // Base rate
  
  // Start with base rate
  let rate = 0.003;
  
  // Add rank bonus if applicable
  if (userData.miningStats?.rank) {
    switch (userData.miningStats.rank) {
      case MemberRank.MINER:
        rate *= 1.1; // 10% bonus
        break;
      case MemberRank.LEADER:
        rate *= 1.25; // 25% bonus
        break;
    }
  }
  
  // Add upgrade bonuses if any
  const upgradeBonus = userData.upgrades?.reduce((total, upgrade) => {
    return total + (upgrade.rateBonus || 0);
  }, 0) || 0;
  
  return parseFloat((rate + upgradeBonus).toFixed(4));
}

/**
 * Update user rank based on mining days
 */
export async function updateUserRank(userId: string): Promise<string | null> {
  try {
    const userData = await getUserData(userId);
    
    if (!userData || !userData.miningStats) {
      return null;
    }
    
    const miningDays = userData.miningStats.totalDays || 0;
    let newRank: MemberRank;
    
    // Determine rank based on mining days
    if (miningDays >= 101) {
      newRank = MemberRank.LEADER;
    } else if (miningDays >= 31) {
      newRank = MemberRank.MINER;
    } else {
      newRank = MemberRank.ROOKIE;
    }
    
    // Update rank if changed
    if (userData.miningStats.rank !== newRank) {
      await updateDoc(doc(db, "users", userId), {
        "miningStats.rank": newRank
      });
      
      toast.success(`Tebrikler! Yeni rütbeniz: ${newRank}`);
      return newRank;
    }
    
    return userData.miningStats.rank || null;
  } catch (error) {
    errorLog("rankService", "Failed to update user rank:", error);
    return null;
  }
}
