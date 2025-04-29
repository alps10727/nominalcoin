
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Mission } from '@/pages/Upgrades';
import { useAdMob } from '@/hooks/useAdMob';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

interface MissionItemProps {
  mission: Mission;
  onClaim: (mission: Mission, byAdReward?: boolean) => void;
  onConnect?: () => void;
  isLoading: boolean;
}

const MissionItem = ({ mission, onClaim, onConnect, isLoading }: MissionItemProps) => {
  const progressPercentage = (mission.progress / mission.total) * 100;
  const isCompleted = mission.progress >= mission.total;
  const [isAdLoading, setIsAdLoading] = useState(false);
  const { showRewardAd, isInitialized } = useAdMob();
  
  // Mining Speed Mission - Add special handling for showing reward ad
  const isMiningSpeedMission = mission.id === "mining-time";
  
  // For handling ad-based claim
  const handleAdRewardClaim = async () => {
    if (!isInitialized) {
      toast.error("Reklam servisi henüz hazır değil");
      return;
    }
    
    try {
      setIsAdLoading(true);
      debugLog('MissionItem', 'Attempting to show reward ad');
      
      const rewarded = await showRewardAd();
      if (rewarded) {
        debugLog('MissionItem', 'Ad reward successful');
        // Pass true as second parameter to indicate this is an ad-based reward
        onClaim(mission, true);
        toast.success("Madencilik hızı artırıldı!");
      } else {
        toast.error("Reklam tamamlanamadı. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      debugLog('MissionItem', 'Error showing reward ad', error);
      toast.error("Reklam gösterilirken bir hata oluştu");
    } finally {
      setIsAdLoading(false);
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-800/70 mr-3">
              {mission.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-200">{mission.title}</h3>
              <p className="text-xs text-gray-400">{mission.description}</p>
            </div>
          </div>
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
          )}
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>İlerleme</span>
            <span>{mission.progress}/{mission.total}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-700" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-400">Ödül:</span> 
            <span className="text-indigo-400 font-semibold">
              {isMiningSpeedMission ? '+0.001 Hız' : `${mission.reward} NC`}
            </span>
          </div>
          
          {isCompleted ? (
            isMiningSpeedMission ? (
              <Button 
                onClick={handleAdRewardClaim} 
                disabled={isLoading || mission.claimed || isAdLoading}
                size="sm" 
                className={`${mission.claimed ? 'bg-green-900/50' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} h-8`}
              >
                {mission.claimed ? 'Alındı' : isAdLoading ? 'Yükleniyor...' : 'Ödülü Al'} 
                {!mission.claimed && !isAdLoading && <ArrowRight className="ml-1 h-3 w-3" />}
              </Button>
            ) : (
              <Button 
                onClick={() => onClaim(mission)}
                disabled={isLoading || mission.claimed}
                size="sm" 
                className={`${mission.claimed ? 'bg-green-900/50' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} h-8`}
              >
                {mission.claimed ? 'Alındı' : 'Ödülü Al'} {!mission.claimed && <ArrowRight className="ml-1 h-3 w-3" />}
              </Button>
            )
          ) : mission.id === 'social-twitter' ? (
            <Button 
              onClick={onConnect} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 h-8"
            >
              Bağlan <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-400 h-8"
              disabled
            >
              Devam Ediyor
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionItem;
