
import React, { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MissionsList from "@/components/upgrades/MissionsList";
import { Mission } from "@/types/missions";
import { toast } from "sonner";
import { fetchMissions, claimMissionReward, activateMiningBoost } from "@/services/missionsService";
import { debugLog, errorLog } from "@/utils/debugUtils";

const Upgrades = () => {
  const { t } = useLanguage();
  const { currentUser, userData, updateUserData } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadMissions();
  }, [currentUser]);
  
  const loadMissions = async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const loadedMissions = await fetchMissions(currentUser.uid);
      setMissions(loadedMissions);
    } catch (error) {
      errorLog("Upgrades", "Error loading missions:", error);
      toast.error("Görevler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClaimReward = async (mission: Mission) => {
    if (!currentUser || !userData) {
      toast.error("Bu görevi tamamlamak için giriş yapmalısınız");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Görev özel işlemi (çark ödülü, boost vs.)
      if (mission.boostAmount && mission.boostEndTime) {
        // Kazım hızı artışı için özel işlem
        const currentRate = userData.miningRate || 0.003;
        const boostAmount = mission.boostAmount;
        const newRate = currentRate + boostAmount;
        
        // Firebase'e kaydet
        await updateUserData({
          miningRate: newRate,
          boostEndTime: mission.boostEndTime,
          boostAmount: boostAmount
        });
        
        toast.success(`Kazım hızınız 24 saatliğine ${boostAmount} arttı!`);
      }
      
      if (mission.reward > 0) {
        // Normal ödül işlemi (NC)
        const currentBalance = userData.balance || 0;
        const result = await claimMissionReward(currentUser.uid, mission, currentBalance);
        
        if (result.success) {
          // Kullanıcı verilerini güncelle
          await updateUserData({ balance: result.newBalance });
          
          // Satın alma görevi tek kullanımlık olduğu için listeden kaldır
          if (mission.id === 'purchase-reward' && missions) {
            setMissions(missions.filter(m => m.id !== 'purchase-reward'));
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
      const currentRate = userData.miningRate || 0.003;
      const result = await activateMiningBoost(currentUser.uid, currentRate);
      
      if (result.success) {
        // Kullanıcı verilerini güncelle
        await updateUserData({ 
          miningRate: result.newRate,
          boostEndTime: result.boostEndTime
        });
        
        // Görevi güncelle
        setMissions(prev => prev.map(m => 
          m.id === 'mining-boost' 
            ? { 
                ...m, 
                cooldownEnd: result.boostEndTime,
                lastClaimed: Date.now()
              } 
            : m
        ));
      }
    } catch (error) {
      errorLog("Upgrades", "Error activating mining boost:", error);
      toast.error("Kazım hızı arttırılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWheelSpin = () => {
    // FortuneWheel komponenti içinde işleniyor
    debugLog("Upgrades", "Wheel spin initiated");
  };

  return (
    <div className="w-full min-h-[100dvh] px-4 py-6 relative">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold fc-gradient-text flex items-center">
          <Gift className="mr-2 h-6 w-6 text-indigo-400" />
          {t("missions.title") || "Görevler"}
        </h1>
        <p className="text-gray-400">
          {t("missions.subtitle") || "Görevleri tamamlayarak ödüller kazanın"}
        </p>
      </div>

      <div className="mt-6">
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center p-10 bg-navy-800/50 border border-navy-700 rounded-lg">
            <p className="text-gray-300 mb-3">Görevlere erişmek için giriş yapmalısınız.</p>
          </div>
        ) : (
          <MissionsList 
            missions={missions}
            onClaim={handleClaimReward}
            onActivateBoost={handleActivateBoost}
            onWheel={handleWheelSpin}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Upgrades;
