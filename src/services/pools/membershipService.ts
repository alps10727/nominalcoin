
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MiningPool, MemberRank } from "@/types/pools";
import { UserData } from "@/types/storage";
import { getPool, getUserData } from "./poolHelpers";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Update user's pool membership
 */
export async function updateUserPoolMembership(userId: string, poolId: string): Promise<void> {
  const now = new Date().toISOString();
  
  await updateDoc(doc(db, "users", userId), {
    "poolMembership.currentPool": poolId,
    "poolMembership.joinDate": now,
    "poolMembership.lastPoolChangeDate": now
  });
}

/**
 * Check if user meets pool requirements
 */
export async function checkPoolRequirements(userId: string, poolId: string): Promise<{ 
  meetsRequirements: boolean; 
  reason?: string; 
}> {
  try {
    // Get pool and user data
    const [poolData, userData] = await Promise.all([
      getPool(poolId),
      getUserData(userId)
    ]);
    
    if (!poolData) {
      return { meetsRequirements: false, reason: "Havuz bulunamadı" };
    }
    
    if (!userData) {
      return { meetsRequirements: false, reason: "Kullanıcı verileri bulunamadı" };
    }
    
    const miningDays = userData.miningStats?.totalDays || 0;
    const balance = userData.balance || 0;
    const userRank = userData.miningStats?.rank || MemberRank.ROOKIE;
    
    // Check requirements
    if (miningDays < poolData.minRequirements.miningDays) {
      return { 
        meetsRequirements: false, 
        reason: `Minimum ${poolData.minRequirements.miningDays} gün madencilik gerekli` 
      };
    }
    
    if (balance < poolData.minRequirements.minBalance) {
      return { 
        meetsRequirements: false, 
        reason: `Minimum ${poolData.minRequirements.minBalance} NC gerekli` 
      };
    }
    
    // Check minimum rank requirement if specified
    if (poolData.minRank && poolData.minRank !== MemberRank.ROOKIE) {
      // Define rank hierarchy for comparison
      const rankHierarchy = {
        [MemberRank.ROOKIE]: 0,
        [MemberRank.MINER]: 1,
        [MemberRank.LEADER]: 2
      };
      
      if (rankHierarchy[userRank as MemberRank] < rankHierarchy[poolData.minRank as MemberRank]) {
        return {
          meetsRequirements: false,
          reason: `Minimum "${poolData.minRank}" rütbesi gerekli`
        };
      }
    }
    
    // Check if pool has capacity
    if (poolData.memberCount >= (poolData.capacity || 100)) {
      return { meetsRequirements: false, reason: "Havuz kapasitesi dolu" };
    }
    
    // Check cooldown period (24 hours between pool changes)
    const lastChangeDate = userData.poolMembership?.lastPoolChangeDate;
    if (lastChangeDate) {
      const lastChange = new Date(lastChangeDate);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        return { 
          meetsRequirements: false, 
          reason: `Havuz değişikliği için ${Math.ceil(24 - hoursDiff)} saat beklemelisiniz` 
        };
      }
    }
    
    return { meetsRequirements: true };
  } catch (error) {
    errorLog("poolService", "Error checking pool requirements:", error);
    return { meetsRequirements: false, reason: "Kontrol sırasında bir hata oluştu" };
  }
}

/**
 * Join a pool
 */
export async function joinPool(userId: string, poolId: string): Promise<boolean> {
  try {
    // Check requirements
    const { meetsRequirements, reason } = await checkPoolRequirements(userId, poolId);
    
    if (!meetsRequirements) {
      toast.error(reason || "Havuza katılma gereksinimleri karşılanmıyor");
      return false;
    }
    
    // Update user membership
    await updateUserPoolMembership(userId, poolId);
    
    // Update pool member count
    await updateDoc(doc(db, "pools", poolId), {
      memberCount: increment(1)
    });
    
    toast.success("Havuza başarıyla katıldınız");
    return true;
  } catch (error) {
    errorLog("poolService", "Failed to join pool:", error);
    toast.error("Havuza katılırken bir hata oluştu");
    return false;
  }
}

/**
 * Leave current pool
 */
export async function leavePool(userId: string): Promise<boolean> {
  try {
    const userData = await getUserData(userId);
    
    if (!userData || !userData.poolMembership || !userData.poolMembership.currentPool) {
      toast.error("Aktif bir havuz üyeliğiniz bulunmuyor");
      return false;
    }
    
    const currentPoolId = userData.poolMembership.currentPool;
    
    // Update user data
    await updateDoc(doc(db, "users", userId), {
      "poolMembership.currentPool": null,
      "poolMembership.lastPoolChangeDate": new Date().toISOString()
    });
    
    // Update pool member count
    await updateDoc(doc(db, "pools", currentPoolId), {
      memberCount: increment(-1)
    });
    
    toast.success("Havuzdan ayrıldınız");
    return true;
  } catch (error) {
    errorLog("poolService", "Failed to leave pool:", error);
    toast.error("Havuzdan ayrılırken bir hata oluştu");
    return false;
  }
}
