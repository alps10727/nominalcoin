
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getPool,
  joinPool,
  leavePool,
  createPool,
  getAllPools,
  updateUserRank
} from "@/services/pools/poolService";
import { MiningPool } from "@/types/pools";
import { debugLog } from "@/utils/debugUtils";

export function usePoolSystem() {
  const { currentUser, userData, updateUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentPool, setCurrentPool] = useState<MiningPool | null>(null);
  const [availablePools, setAvailablePools] = useState<MiningPool[]>([]);
  
  // Load current pool data
  useEffect(() => {
    async function loadPoolData() {
      if (!userData || !userData.poolMembership?.currentPool) {
        setCurrentPool(null);
        setLoading(false);
        return;
      }
      
      try {
        const poolId = userData.poolMembership.currentPool;
        const pool = await getPool(poolId);
        setCurrentPool(pool);
      } catch (error) {
        debugLog("usePoolSystem", "Error loading pool data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPoolData();
  }, [userData]);
  
  // Load available pools
  const loadAvailablePools = async () => {
    setLoading(true);
    try {
      const pools = await getAllPools({ isPublic: true });
      setAvailablePools(pools);
    } catch (error) {
      debugLog("usePoolSystem", "Error loading available pools:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Join a mining pool
  const handleJoinPool = async (poolId: string) => {
    if (!currentUser) return false;
    
    setLoading(true);
    const success = await joinPool(currentUser.uid, poolId);
    
    if (success) {
      // Refresh user data and current pool
      await updateUserData({});
      const pool = await getPool(poolId);
      setCurrentPool(pool);
    }
    
    setLoading(false);
    return success;
  };
  
  // Leave current pool
  const handleLeavePool = async () => {
    if (!currentUser || !userData?.poolMembership?.currentPool) return false;
    
    setLoading(true);
    const success = await leavePool(currentUser.uid);
    
    if (success) {
      setCurrentPool(null);
      await updateUserData({});
    }
    
    setLoading(false);
    return success;
  };
  
  // Create a new pool
  const handleCreatePool = async (poolData: MiningPool) => {
    if (!currentUser) return null;
    
    setLoading(true);
    const poolId = await createPool(poolData, currentUser.uid);
    
    if (poolId) {
      // Refresh user data and current pool
      await updateUserData({});
      const pool = await getPool(poolId);
      setCurrentPool(pool);
    }
    
    setLoading(false);
    return poolId;
  };
  
  // Check and update user rank
  const checkRankUpdate = async () => {
    if (!currentUser) return null;
    return await updateUserRank(currentUser.uid);
  };

  return {
    loading,
    currentPool,
    availablePools,
    loadAvailablePools,
    joinPool: handleJoinPool,
    leavePool: handleLeavePool,
    createPool: handleCreatePool,
    checkRankUpdate
  };
}
