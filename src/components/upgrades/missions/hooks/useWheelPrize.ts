
import { useState } from "react";
import { Mission, WheelPrize } from "@/types/missions";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { useAdMob } from "@/hooks/useAdMob";

export const useWheelPrize = (
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>,
  loadMissions: () => Promise<void>
) => {
  const { currentUser, userData, updateUserData } = useAuth();
  const { showRewardedAd } = useAdMob();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleWheelSpin = () => {
    // FortuneWheel bileşeni içinde işleniyor
    debugLog("Upgrades", "Wheel spin initiated");
  };
  
  const handleWheelPrize = async (prize: WheelPrize, mission: Mission) => {
    if (!currentUser || !userData) {
      toast.error("Bu ödülü almak için giriş yapmalısınız");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Show rewarded ad before giving wheel prize
      await showRewardedAd(async () => {
        debugLog("Upgrades", `Processing wheel prize: ${JSON.stringify(prize)}`);
        
        if (prize.type === 'coins') {
          // Para ödülü
          const currentBalance = userData.balance || 0;
          const newBalance = parseFloat((currentBalance + prize.value).toFixed(6));
          
          debugLog("Upgrades", `Adding coins: Current balance ${currentBalance}, Prize: ${prize.value}, New balance: ${newBalance}`);
          
          // Kullanıcı bakiyesini güncelle
          await updateUserData({ balance: newBalance });
          toast.success(`${prize.value} NC bakiyenize eklendi!`);
        } else if (prize.type === 'mining_rate') {
          // Kazım hızı artışı
          const currentRate = userData.miningRate || 0.003;
          const newRate = parseFloat((currentRate + prize.value).toFixed(6));
          const boostEndTime = Date.now() + (prize.duration || 24 * 60 * 60 * 1000);
          
          debugLog("Upgrades", `Adding mining rate boost: Current rate ${currentRate}, Boost: ${prize.value}, New rate: ${newRate}`);
          
          // Kullanıcı kazım hızını güncelle
          await updateUserData({
            miningRate: newRate,
            miningStats: {
              ...(userData.miningStats || {}),
              boostEndTime: boostEndTime,
              boostAmount: prize.value
            }
          });
          
          toast.success(`Kazım hızınız 24 saatliğine ${prize.value} arttı!`);
        }
        
        // Set cooldown time for the wheel-of-fortune mission (2 hours)
        const cooldownTime = 2 * 60 * 60 * 1000; // 2 saat
        const now = Date.now();
        const cooldownEnd = now + cooldownTime;
        
        debugLog("Upgrades", `Setting wheel cooldown: Now: ${now}, End: ${cooldownEnd}, Duration: ${cooldownTime}ms`);
        
        // Update mission state locally
        setMissions(prev => prev.map(m => 
          m.id === mission.id 
            ? { 
                ...m, 
                cooldownEnd: cooldownEnd,
                lastClaimed: now
              } 
            : m
        ));
        
        // Update mission in database (important!)
        try {
          const { data, error } = await supabase
            .from('user_missions')
            .upsert({
              user_id: currentUser.id,
              mission_id: mission.id,
              claimed: false,
              last_claimed: now,
              cooldown_end: cooldownEnd,
              progress: mission.progress || 0
            });
            
          if (error) {
            errorLog("Upgrades", "Error updating mission cooldown in database:", error);
          } else {
            debugLog("Upgrades", "Successfully updated mission cooldown in database");
          }
        } catch (err) {
          errorLog("Upgrades", "Exception updating mission cooldown:", err);
        }
        
        // Force reload missions
        await loadMissions();
      });
    } catch (error) {
      errorLog("Upgrades", "Error processing wheel prize:", error);
      toast.error("Ödül işlenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleWheelSpin,
    handleWheelPrize,
    isWheelLoading: isLoading
  };
};
