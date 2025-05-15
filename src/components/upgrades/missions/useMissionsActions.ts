
import { useState } from "react";
import { Mission, WheelPrize } from "@/types/missions";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { claimMissionReward, activateMiningBoost } from "@/services/missions";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { useAdMob } from "@/hooks/useAdMob";

export const useMissionsActions = (
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>,
  loadMissions: () => Promise<void>
) => {
  const { currentUser, userData, updateUserData } = useAuth();
  const { showInterstitialAd, showRewardedAd } = useAdMob();
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
          if (mission.id === 'purchase-reward' && missions) {
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
    handleClaimReward,
    handleActivateBoost,
    handleWheelSpin,
    handleWheelPrize,
    isLoading
  };
};
