
import React, { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MissionsList from "@/components/upgrades/MissionsList";
import { Mission, WheelPrize } from "@/types/missions";
import { toast } from "sonner";
import { fetchMissions } from "@/services/missions";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { useMissionsActions } from "./useMissionsActions";

const MissionContainer = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    handleClaimReward, 
    handleActivateBoost, 
    handleWheelSpin, 
    handleWheelPrize 
  } = useMissionsActions(setMissions, loadMissions);
  
  useEffect(() => {
    loadMissions();
  }, [currentUser]);
  
  async function loadMissions() {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const loadedMissions = await fetchMissions(currentUser.id);
      setMissions(loadedMissions);
    } catch (error) {
      errorLog("Upgrades", "Error loading missions:", error);
      toast.error("Görevler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-[100dvh] px-4 py-6 pb-28 relative">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold fc-gradient-text flex items-center">
          <Gift className="mr-2 h-6 w-6 text-indigo-400" />
          {t("missions.title") || "Görevler"}
        </h1>
        <p className="text-gray-400">
          {t("missions.subtitle") || "Görevleri tamamlayarak ödüller kazanın"}
        </p>
      </div>

      <div className="mt-6 mb-20">
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
            onWheelPrize={handleWheelPrize}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default MissionContainer;
