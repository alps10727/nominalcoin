
import { useState } from "react";
import { Mission } from "@/types/missions";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { claimMissionReward } from "@/services/missions";
import { debugLog, errorLog } from "@/utils/debugUtils";

export const useClaimReward = (
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>,
  loadMissions: () => Promise<void>
) => {
  const { currentUser, userData, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClaimReward = async (mission: Mission) => {
    if (!currentUser || !userData) {
      toast.error("Bu görevi tamamlamak için giriş yapmalısınız");
      return;
    }
    
    try {
      setIsLoading(true);
      
      debugLog("Upgrades", `Claiming reward for mission: ${mission.id}`);
      
      // Görev özel işlemi (çark ödülü, boost vs.)
      if (mission.boostAmount && mission.boostEndTime) {
        // Kazım hızı artışı için özel işlem
        const currentRate = userData.miningRate || 0.003;
        const boostAmount = mission.boostAmount;
        const newRate = parseFloat((currentRate + boostAmount).toFixed(6));
        
        debugLog("Upgrades", `Adding mining boost: Current rate ${currentRate}, Boost amount: ${boostAmount}, New rate: ${newRate}`);
        
        // Supabase'e kaydet - Tip güvenliği sağlandı
        await updateUserData({
          miningRate: newRate,
          miningStats: {
            ...(userData.miningStats || {}),
            boostEndTime: mission.boostEndTime,
            boostAmount: boostAmount
          }
        });
        
        toast.success(`Kazım hızınız 24 saatliğine ${boostAmount} arttı!`);
        
        // Force reload missions
        await loadMissions();
      }
      
      if (mission.reward > 0) {
        // Normal ödül işlemi (NC)
        const currentBalance = userData.balance || 0;
        
        debugLog("Upgrades", `Processing standard reward: ${mission.reward} NC`);
        
        // Supabase için currentUser.id kullanılıyor
        const result = await claimMissionReward(currentUser.id, mission, currentBalance);
        
        if (result.success) {
          // Kullanıcı verilerini güncelle
          await updateUserData({ balance: result.newBalance });
          
          // Satın alma görevi tek kullanımlık olduğu için listeden kaldır
          if (mission.id === 'purchase-reward') {
            setMissions(prev => prev.filter(m => m.id !== 'purchase-reward'));
          } else {
            // Diğer görevleri güncelle
            setMissions(prev => prev.map(m => 
              m.id === mission.id 
                ? { 
                    ...m, 
                    cooldownEnd: Date.now() + (60 * 60 * 1000), // 1 saat
                    lastClaimed: Date.now()
                  } 
                : m
            ));
          }
        }
      }
    } catch (error) {
      errorLog("Upgrades", "Error claiming reward:", error);
      toast.error("Ödül alınırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleClaimReward,
    isClaimLoading: isLoading
  };
};
