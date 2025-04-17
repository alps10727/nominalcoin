
import { useState, useEffect } from "react";
import { MiningPool } from "@/types/pools";

export function usePoolSystem() {
  const [loading, setLoading] = useState(false);
  const [currentPool, setCurrentPool] = useState<MiningPool | null>(null);
  const [availablePools, setAvailablePools] = useState<MiningPool[]>([]);
  
  // Dummy functions to replace Firebase functionality
  const loadAvailablePools = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockPools: MiningPool[] = [
        {
          poolId: "community-pool-123456",
          name: "Community Pool",
          description: "A public mining pool for everyone",
          level: 1,
          owner: "system",
          memberCount: 42,
          createdAt: new Date(),
          capacity: 100,
          isPublic: true,
          minRequirements: {
            minBalance: 0,
            miningDays: 0
          }
        }
      ];
      
      setTimeout(() => {
        setAvailablePools(mockPools);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.log("Error loading available pools:", error);
      setLoading(false);
    }
  };
  
  // Join a mining pool
  const handleJoinPool = async (poolId: string) => {
    setLoading(true);
    
    // Mock successful join
    setTimeout(() => {
      const pool = availablePools.find(p => p.poolId === poolId);
      if (pool) {
        setCurrentPool(pool);
      }
      setLoading(false);
    }, 500);
    
    return true;
  };
  
  // Leave current pool
  const handleLeavePool = async () => {
    setLoading(true);
    
    // Mock successful leave
    setTimeout(() => {
      setCurrentPool(null);
      setLoading(false);
    }, 500);
    
    return true;
  };
  
  // Create a new pool
  const handleCreatePool = async (poolData: any) => {
    setLoading(true);
    
    // Generate a unique pool ID
    const poolId = `${poolData.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
    
    // Create mock pool
    const newPool: MiningPool = {
      poolId,
      name: poolData.name || "New Pool",
      description: poolData.description || "",
      level: poolData.level || 1,
      owner: "current-user",
      memberCount: 1,
      createdAt: new Date(),
      capacity: 100,
      isPublic: poolData.isPublic !== undefined ? poolData.isPublic : true,
      minRequirements: {
        minBalance: poolData.requirements?.minBalance || 0,
        miningDays: poolData.requirements?.minDays || 0
      },
      minRank: poolData.requirements?.minRank ? String(poolData.requirements.minRank) : undefined
    };
    
    setTimeout(() => {
      setCurrentPool(newPool);
      setLoading(false);
    }, 500);
    
    return poolId;
  };
  
  // Check and update user rank
  const checkRankUpdate = async () => {
    return "Rookie";
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
