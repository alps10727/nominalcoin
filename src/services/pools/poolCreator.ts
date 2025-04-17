
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MiningPool } from "@/types/pools";
import { POOL_CAPACITY } from "./poolHelpers";
import { updateUserPoolMembership } from "./membershipService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Pool data structure used by the form
 */
export interface PoolFormData {
  name: string;
  description: string;
  level: number;
  isPublic: boolean;
  requirements: {
    minBalance?: number;
    minDays?: number;
    minRank?: number;
  };
}

/**
 * Create a new pool
 */
export async function createPool(poolData: PoolFormData, userId: string): Promise<string | null> {
  try {
    // Generate a unique pool ID
    const poolId = `${poolData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
    
    const newPool: MiningPool = {
      poolId,
      name: poolData.name,
      description: poolData.description || "",
      level: poolData.level,
      owner: userId,
      memberCount: 0,
      createdAt: null, // We'll set this with serverTimestamp() below
      capacity: POOL_CAPACITY[poolData.level as keyof typeof POOL_CAPACITY] || 100,
      isPublic: poolData.isPublic,
      minRequirements: {
        minBalance: poolData.requirements.minBalance || 0,
        miningDays: poolData.requirements.minDays || 0
      },
      minRank: poolData.requirements.minRank ? String(poolData.requirements.minRank) : undefined
    };
    
    // Use serverTimestamp() when saving to Firestore, but don't assign it directly to createdAt
    await setDoc(doc(db, "pools", poolId), {
      ...newPool,
      createdAt: serverTimestamp()
    });
    
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
