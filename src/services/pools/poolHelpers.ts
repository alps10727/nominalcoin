
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MiningPool } from "@/types/pools";
import { UserData } from "@/types/storage";
import { errorLog } from "@/utils/debugUtils";

// Pool capacity constants
export const POOL_CAPACITY = {
  1: 100,  // Level 1: 100 members
  2: 250,  // Level 2: 250 members
  3: 500   // Level 3: 500 members
};

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
 * Get user data helper
 */
export async function getUserData(userId: string): Promise<UserData | null> {
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
