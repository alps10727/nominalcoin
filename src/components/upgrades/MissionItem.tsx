
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, Lock, TrendingUp, ShoppingCart, Clock } from "lucide-react";
import { Mission, WheelPrize } from '@/types/missions';
import { useLanguage } from '@/contexts/LanguageContext';
import FortuneWheel from './FortuneWheel';

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
  const progressPercentage = (mission.progress / mission.total) * 100;
  const isCompleted = mission.progress >= mission.total;
  const { t } = useLanguage();
  
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  
  // Get the appropriate icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'shopping-cart':
        return <ShoppingCart className="h-5 w-5 text-purple-400" />;
      case 'clock':
        return <Clock className="h-5 w-5 text-blue-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
    }
  };
  
  // Geri sayım süresini kontrol et
  useEffect(() => {
    const checkCooldown = () => {
      if (!mission.cooldownEnd) return null;
      
      const now = Date.now();
      const cooldownEnd = mission.cooldownEnd;
      
      if (now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      
      return null;
    };
    
    // İlk kontrol
    setTimeLeft(checkCooldown());
    
    // 1 saniyede bir güncelle
    const intervalId = setInterval(() => {
      const remaining = checkCooldown();
      setTimeLeft(remaining);
      
      if (!remaining && mission.cooldownEnd) {
        // Soğuma süresi bittiyse interval'i temizle
        clearInterval(intervalId);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [mission.cooldownEnd]);
  
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
  
  // Özel buton metinleri
  const getButtonText = () => {
    if (timeLeft) {
      return timeLeft;
    }
    
    switch (mission.id) {
      case 'mining-boost':
        return "Aktifleştir";
      case 'wheel-of-fortune':
        return "Çevir";
      case 'purchase-reward':
        return mission.claimed ? "Alındı" : "Talep Et";
      default:
        return mission.claimed ? "Alındı" : "Talep Et";
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-800/70 mr-3">
              {getIconComponent(mission.icon)}
            </div>
            <div>
              <h3 className="font-medium text-gray-200">{mission.title}</h3>
              <p className="text-xs text-gray-400">{mission.description}</p>
            </div>
          </div>
          {(mission.claimed && isSingleUse) && (
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
          )}
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{t("missions.progress") || "İlerleme"}</span>
            <span>{mission.progress}/{mission.total}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-700" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            {mission.id !== 'wheel-of-fortune' && (
              <>
                <span className="text-gray-400">{t("missions.reward") || "Ödül"} </span> 
                <span className="text-indigo-400 font-semibold">
                  {mission.id === 'mining-boost' ? 
                    "+0.005 Kazım Hızı" : 
                    `${mission.reward} NC`}
                </span>
              </>
            )}
            {mission.id === 'wheel-of-fortune' && (
              <span className="text-indigo-400 font-semibold">
                {t("missions.randomReward") || "Rastgele Ödül"}
              </span>
            )}
          </div>
          
          <Button 
            onClick={handleAction}
            disabled={isDisabled || isLoading}
            size="sm" 
            className={`${
              isDisabled 
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            } h-8`}
          >
            {isDisabled && timeLeft ? (
              <Lock className="mr-1 h-3 w-3" />
            ) : null}
            {getButtonText()} {!isDisabled && !mission.claimed && <ArrowRight className="ml-1 h-3 w-3" />}
          </Button>
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
