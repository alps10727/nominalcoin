
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Mission, WheelPrize } from '@/types/missions';
import { useLanguage } from '@/contexts/LanguageContext';
import FortuneWheel from '../FortuneWheel';
import MissionHeader from './MissionHeader';
import MissionProgress from './MissionProgress';
import MissionReward from './MissionReward';
import MissionButton from './MissionButton';
import { useMissionCooldown } from './useMissionCooldown';

interface MissionItemProps {
  mission: Mission;
  onClaim: (mission: Mission) => void;
  onActivateBoost?: () => void;
  onWheel?: () => void;
  onWheelPrize?: (prize: WheelPrize, mission: Mission) => void;
  onConnect?: () => void;
  isLoading: boolean;
}

const MissionItem = ({ 
  mission, 
  onClaim, 
  onActivateBoost, 
  onWheel,
  onWheelPrize,
  onConnect, 
  isLoading 
}: MissionItemProps) => {
  const { t } = useLanguage();
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const { timeLeft } = useMissionCooldown(mission.cooldownEnd);
  
  // Tek seferlik görev ve tamamlanmış mı kontrol et
  const isSingleUse = mission.id === 'purchase-reward';
  const isDisabled = !!timeLeft || (isSingleUse && mission.claimed);
  
  // Görev tipine göre özel buton işlevlerini belirle
  const handleAction = () => {
    if (mission.id === 'mining-boost' && onActivateBoost) {
      onActivateBoost();
    } else if (mission.id === 'wheel-of-fortune' && onWheel) {
      if (onWheel) onWheel();
      setIsWheelOpen(true);
    } else {
      onClaim(mission);
    }
  };
  
  // Çark ödülünü işle
  const handlePrizeWon = (prize: WheelPrize) => {
    if (onWheelPrize) {
      onWheelPrize(prize, mission);
    }
    setIsWheelOpen(false);
  };
  
  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 overflow-hidden">
      <CardContent className="p-4">
        <MissionHeader 
          title={mission.title}
          description={mission.description}
          icon={mission.icon}
          claimed={mission.claimed}
          isSingleUse={isSingleUse}
        />
        
        <MissionProgress progress={mission.progress} total={mission.total} />
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            <MissionReward id={mission.id} reward={mission.reward} t={t} />
          </div>
          
          <MissionButton 
            id={mission.id}
            isDisabled={isDisabled}
            timeLeft={timeLeft}
            claimed={mission.claimed}
            onClick={handleAction}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
      
      {/* Çark bileşeni */}
      {mission.id === 'wheel-of-fortune' && (
        <FortuneWheel 
          isOpen={isWheelOpen} 
          onClose={() => setIsWheelOpen(false)}
          onPrizeWon={handlePrizeWon}
          cooldownEnd={mission.cooldownEnd}
        />
      )}
    </Card>
  );
};

export default MissionItem;
