
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Timestamp } from "@/types/storage"; // Import our Timestamp mock

// Add your pool system hook implementation here
export function usePoolSystem(userData: any, updateUserData: any) {
  const [availablePools, setAvailablePools] = useState([
    { id: "beginners", name: "Beginners Pool", minRate: 0, maxRate: 0.005, members: 150 },
    { id: "advanced", name: "Advanced Pool", minRate: 0.005, maxRate: 0.02, members: 75 },
    { id: "pro", name: "Pro Miners", minRate: 0.02, maxRate: 0.05, members: 35 }
  ]);
  
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [joinDate, setJoinDate] = useState<string | null>(null);
  const [canChangePool, setCanChangePool] = useState(true);
  const [lastChange, setLastChange] = useState<string | null>(null);
  
  // Initialize pool data from user data
  useEffect(() => {
    if (userData && userData.poolMembership) {
      setSelectedPool(userData.poolMembership.currentPool);
      setJoinDate(userData.poolMembership.joinDate);
      setLastChange(userData.poolMembership.lastPoolChangeDate || null);
      
      // Check if user can change pools (only once per 24 hours)
      if (userData.poolMembership.lastPoolChangeDate) {
        const lastChangeDate = new Date(userData.poolMembership.lastPoolChangeDate);
        const now = new Date();
        const hoursSinceLastChange = (now.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60);
        
        setCanChangePool(hoursSinceLastChange >= 24);
      }
    }
  }, [userData]);
  
  // Join a mining pool
  const joinPool = async (poolId: string) => {
    if (!canChangePool && selectedPool) {
      toast.error("Havuz değişikliği için 24 saat beklemelisiniz");
      return false;
    }
    
    // Check if user's mining rate is compatible with pool
    const targetPool = availablePools.find(pool => pool.id === poolId);
    if (!targetPool) {
      toast.error("Seçilen havuz bulunamadı");
      return false;
    }
    
    if (userData && (userData.miningRate < targetPool.minRate || userData.miningRate > targetPool.maxRate)) {
      toast.error(`Madencilik hızınız bu havuz için uygun değil (${targetPool.minRate} - ${targetPool.maxRate})`);
      return false;
    }
    
    try {
      const now = new Date();
      const timestamp = Timestamp.fromDate(now); // Use our mock Timestamp
      
      // Update user data with new pool membership
      await updateUserData({
        poolMembership: {
          currentPool: poolId,
          joinDate: now.toISOString(),
          lastPoolChangeDate: now.toISOString()
        }
      });
      
      setSelectedPool(poolId);
      setJoinDate(now.toISOString());
      setLastChange(now.toISOString());
      setCanChangePool(false);
      
      toast.success(`${targetPool.name} havuzuna başarıyla katıldınız!`);
      return true;
    } catch (error) {
      console.error("Havuza katılma hatası:", error);
      toast.error("Havuza katılırken bir hata oluştu");
      return false;
    }
  };
  
  // Leave current pool
  const leavePool = async () => {
    if (!selectedPool) {
      toast.error("Zaten bir havuzda değilsiniz");
      return false;
    }
    
    if (!canChangePool) {
      toast.error("Havuzdan ayrılmak için 24 saat beklemelisiniz");
      return false;
    }
    
    try {
      const now = new Date();
      
      // Update user data to leave pool
      await updateUserData({
        poolMembership: {
          currentPool: null,
          joinDate: null,
          lastPoolChangeDate: now.toISOString()
        }
      });
      
      setSelectedPool(null);
      setJoinDate(null);
      setLastChange(now.toISOString());
      setCanChangePool(false);
      
      toast.success("Madencilik havuzundan ayrıldınız");
      return true;
    } catch (error) {
      console.error("Havuzdan ayrılma hatası:", error);
      toast.error("Havuzdan ayrılırken bir hata oluştu");
      return false;
    }
  };
  
  return {
    availablePools,
    selectedPool,
    joinDate,
    canChangePool,
    joinPool,
    leavePool
  };
}
