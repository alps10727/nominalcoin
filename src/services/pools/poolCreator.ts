
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MiningPool } from "@/types/pools";
import { POOL_CAPACITY } from "./poolHelpers";
import { updateUserPoolMembership } from "./membershipService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Create a new pool
 */
export async function createPool(poolData: MiningPool, userId: string): Promise<string | null> {
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
