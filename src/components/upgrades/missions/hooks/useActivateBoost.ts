
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { activateMiningBoost } from "@/services/missions";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { useAdMob } from "@/hooks/useAdMob";
import { Mission } from "@/types/missions";

export const useActivateBoost = (
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>,
  loadMissions: () => Promise<void>
) => {
  const { currentUser, userData, updateUserData } = useAuth();
  const { showInterstitialAd } = useAdMob();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleActivateBoost = async () => {
    if (!currentUser || !userData) {
      toast.error("Bu görevi tamamlamak için giriş yapmalısınız");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Show interstitial ad before activating boost
      await showInterstitialAd(async () => {
        // This callback runs after the ad is shown or skipped
        const currentRate = userData.miningRate || 0.003;
        
        debugLog("Upgrades", `Activating mining boost with current rate: ${currentRate}`);
        
        // Supabase için currentUser.id kullanılıyor
        const result = await activateMiningBoost(currentUser.id, currentRate);
        
        if (result.success) {
          debugLog("Upgrades", `Mining boost activated successfully, new rate: ${result.newRate}`);
          
          // Kullanıcı verilerini güncelle - Tip güvenliği sağlandı
          const boostData = {
            miningRate: result.newRate,
            miningStats: {
              ...(userData.miningStats || {}),
              boostEndTime: result.boostEndTime,
              boostAmount: 0.005 // Explicitly set the boost amount
            }
          };
          
          debugLog("Upgrades", `Applying mining boost: New rate ${result.newRate}, Boost end time: ${new Date(result.boostEndTime || 0).toISOString()}`);
          
          await updateUserData(boostData);
          
          // Görevi güncelle
          setMissions(prev => prev.map(m => 
            m.id === 'mining-boost' 
              ? { 
                  ...m, 
                  cooldown_end: result.boostEndTime,
                  last_claimed: Date.now()
                } 
              : m
          ));
          
          toast.success(`Kazım hızınız 1 saatliğine arttı!`);
          
          // Force reload missions
          await loadMissions();
        }
      });
    } catch (error) {
      errorLog("Upgrades", "Error activating mining boost:", error);
      toast.error("Kazım hızı arttırılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleActivateBoost,
    isBoostLoading: isLoading
  };
};
