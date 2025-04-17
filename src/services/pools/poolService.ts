
import { doc, collection, getDoc, setDoc, updateDoc, query, where, getDocs, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MiningPool, PoolMembership, MemberRank } from "@/types/pools";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

// Pool capacity constants
const POOL_CAPACITY = {
  1: 100,  // Level 1: 100 members
  2: 250,  // Level 2: 250 members
  3: 500   // Level 3: 500 members
};

/**
 * Create a new pool
 */
export async function createPool(poolData: Omit<MiningPool, 'createdAt'>, userId: string): Promise<string | null> {
  try {
    // Generate a unique pool ID
    const poolId = `${poolData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
    
    const newPool = {
      ...poolData,
      poolId,
      owner: userId,
      memberCount: 0,
      createdAt: serverTimestamp(),
      capacity: POOL_CAPACITY[poolData.level as keyof typeof POOL_CAPACITY] || 100
    };
    
    await setDoc(doc(db, "pools", poolId), newPool);
    debugLog("poolService", "New pool created:", poolId);
    
    // Update creator's membership
    await updateUserPoolMembership(userId, poolId);
    
    return poolId;
  } catch (error) {
    errorLog("poolService", "Failed to create pool:", error);
    toast.error("Havuz oluşturulurken bir hata oluştu");
    return null;
  }
}

/**
 * Get pool details by ID
 */
export async function getPool(poolId: string): Promise<MiningPool | null> {
  try {
    const poolDoc = await getDoc(doc(db, "pools", poolId));
    if (poolDoc.exists()) {
      return poolDoc.data() as MiningPool;
    }
    return null;
  } catch (error) {
    errorLog("poolService", "Failed to get pool:", error);
    return null;
  }
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
    
    // Check if pool has capacity
    if (poolData.memberCount >= (poolData.capacity || POOL_CAPACITY[poolData.level])) {
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

/**
 * Update user's pool membership
 */
async function updateUserPoolMembership(userId: string, poolId: string): Promise<void> {
  const now = new Date().toISOString();
  
  await updateDoc(doc(db, "users", userId), {
    "poolMembership.currentPool": poolId,
    "poolMembership.joinDate": now,
    "poolMembership.lastPoolChangeDate": now
  });
}

/**
 * Get user data helper
 */
async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    errorLog("poolService", "Failed to get user data:", error);
    return null;
  }
}

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
    errorLog("poolService", "Failed to update user rank:", error);
    return null;
  }
}

/**
 * Get all pools (with optional filtering)
 */
export async function getAllPools(filter?: { minLevel?: number, isPublic?: boolean }): Promise<MiningPool[]> {
  try {
    let poolQuery = collection(db, "pools");
    
    if (filter) {
      // Create filtered query
      poolQuery = query(
        collection(db, "pools"),
        ...Object.entries(filter).map(([key, value]) => where(key, "==", value))
      );
    }
    
    const poolSnapshot = await getDocs(poolQuery);
    const pools: MiningPool[] = [];
    
    poolSnapshot.forEach((doc) => {
      pools.push(doc.data() as MiningPool);
    });
    
    return pools;
  } catch (error) {
    errorLog("poolService", "Failed to get pools:", error);
    return [];
  }
}
