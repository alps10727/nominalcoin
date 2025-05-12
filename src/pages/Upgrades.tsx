
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchMissions, claimMissionReward, activateMiningBoost } from '@/services/missionsService';
import { Mission, WheelPrize } from '@/types/missions';
import MissionsList from '@/components/upgrades/MissionsList';
import { toast } from 'sonner';
import LoadingScreen from '@/components/dashboard/LoadingScreen';
import { debugLog, errorLog } from '@/utils/debugUtils';

const Upgrades = () => {
  const { userData, currentUser, updateUserData } = useAuth();
  const { t } = useLanguage();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadMissions = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const missionData = await fetchMissions(currentUser.id);
        setMissions(missionData);
      } catch (error) {
        errorLog("Upgrades", "Error loading missions", error);
        toast.error("Görevler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    
    loadMissions();
  }, [currentUser]);

  const handleClaimMission = async (mission: Mission) => {
    if (!currentUser || !userData) return;
    
    try {
      setIsUpdating(true);
      
      // Görev ödülünü talep et
      const { success, newBalance } = await claimMissionReward(
        currentUser.id,
        mission,
        userData.balance || 0
      );
      
      if (success) {
        // Bakiyeyi güncelle
        await updateUserData({ balance: newBalance });
        
        // Görevleri yenile
        const updatedMissions = await fetchMissions(currentUser.id);
        setMissions(updatedMissions);
      }
    } catch (error) {
      errorLog("Upgrades", "Error claiming mission", error);
      toast.error("Görev ödülü alınırken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleActivateBoost = async () => {
    if (!currentUser || !userData) return;
    
    try {
      setIsUpdating(true);
      
      const currentRate = userData.miningRate || 0.003;
      
      const { success, newRate, boostEndTime } = await activateMiningBoost(
        currentUser.id,
        currentRate
      );
      
      if (success) {
        // Kazım hızını güncelle
        await updateUserData({ 
          miningRate: newRate,
          miningStats: {
            ...(userData.miningStats || {}),
            boostEndTime,
            boostAmount: 0.005
          }
        });
        
        // Görevleri yenile
        const updatedMissions = await fetchMissions(currentUser.id);
        setMissions(updatedMissions);
      }
    } catch (error) {
      errorLog("Upgrades", "Error activating boost", error);
      toast.error("Kazım hızı arttırılırken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleOpenWheel = async () => {
    // Çark açma işlemi için sadece bildirim ver, çark komponenti içinde işlenecek
    debugLog("Upgrades", "Fortune wheel opened");
  };
  
  const handleWheelPrize = async (prize: WheelPrize, mission: Mission) => {
    if (!currentUser || !userData) return;
    
    try {
      setIsUpdating(true);
      
      // Ödül tipine göre farklı işlemler yap
      if (prize.type === 'coins') {
        // Bakiye güncellemesi
        const newBalance = (userData.balance || 0) + prize.value;
        
        // Bakiyeyi güncelle
        await updateUserData({ balance: newBalance });
        
        toast.success(`${prize.value} NC kazandınız!`);
      } else if (prize.type === 'mining_rate') {
        // Kazım hızı artışı
        const currentRate = userData.miningRate || 0.003;
        const newRate = currentRate + prize.value;
        const boostEndTime = Date.now() + (prize.duration || 0);
        
        // Kazım hızını ve istatistikleri güncelle
        await updateUserData({ 
          miningRate: newRate,
          miningStats: {
            ...(userData.miningStats || {}),
            boostEndTime,
            boostAmount: prize.value
          }
        });
        
        toast.success(`${prize.value} kazım hızı artışı 24 saat boyunca aktif!`);
      }
      
      // Görevleri yenile
      const updatedMissions = await fetchMissions(currentUser.id);
      setMissions(updatedMissions);
    } catch (error) {
      errorLog("Upgrades", "Error processing wheel prize", error);
      toast.error("Çark ödülü işlenirken bir hata oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <p className="text-gray-400">{t("common.loginRequired")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col">
      <Helmet>
        <title>{t("upgrades.pageTitle")} | NCoin</title>
      </Helmet>
      
      <main className="flex-1 px-4 py-4 md:px-6 md:py-6 pb-32 w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-300">{t("upgrades.title")}</h1>
          <p className="text-purple-300/80 text-sm mt-1">
            {t("upgrades.description")}
          </p>
        </div>
        
        <div className="space-y-6">
          {loading ? (
            <div className="py-10">
              <LoadingScreen text={t("upgrades.loading")} />
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-purple-200 mb-4">{t("upgrades.dailyMissions")}</h2>
                <MissionsList 
                  missions={missions} 
                  onClaim={handleClaimMission}
                  onActivateBoost={handleActivateBoost}
                  onWheel={handleOpenWheel}
                  onWheelPrize={handleWheelPrize}
                  isLoading={isUpdating}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upgrades;
