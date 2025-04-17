
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { MiningPool } from "@/types/pools";
import { errorLog } from "@/utils/debugUtils";

/**
 * Get all pools (with optional filtering)
 */
export async function getAllPools(filter?: { minLevel?: number, isPublic?: boolean }): Promise<MiningPool[]> {
  try {
    let poolQuery;
    
    if (filter) {
      // Create filtered query
      const constraints = [];
      if (filter.minLevel !== undefined) {
        constraints.push(where("level", ">=", filter.minLevel));
      }
      if (filter.isPublic !== undefined) {
        constraints.push(where("isPublic", "==", filter.isPublic));
      }
      
      poolQuery = query(collection(db, "pools"), ...constraints);
    } else {
      // Just use the collection reference if no filters
      poolQuery = collection(db, "pools");
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
