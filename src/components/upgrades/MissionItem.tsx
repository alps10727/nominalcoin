
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Mission } from '@/pages/Upgrades';
import { useLanguage } from '@/contexts/LanguageContext';

interface MissionItemProps {
  mission: Mission;
  onClaim: (mission: Mission) => void;
  onConnect?: () => void;
  isLoading: boolean;
}

const MissionItem = ({ mission, onClaim, onConnect, isLoading }: MissionItemProps) => {
  const progressPercentage = (mission.progress / mission.total) * 100;
  const isCompleted = mission.progress >= mission.total;
  const { t } = useLanguage();
  
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
            <span>{t("missions.progress")}</span>
            <span>{mission.progress}/{mission.total}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-700" />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-400">{t("missions.reward")} </span> 
            <span className="text-indigo-400 font-semibold">
              {`${mission.reward} NC`}
            </span>
          </div>
          
          {isCompleted ? (
            <Button 
              onClick={() => onClaim(mission)}
              disabled={isLoading || mission.claimed}
              size="sm" 
              className={`${mission.claimed ? 'bg-green-900/50' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} h-8`}
            >
              {mission.claimed ? t("missions.claimed") : t("missions.claim")} {!mission.claimed && <ArrowRight className="ml-1 h-3 w-3" />}
            </Button>
          ) : mission.id === 'social-twitter' ? (
            <Button 
              onClick={onConnect} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 h-8"
            >
              {t("missions.connect")} <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-400 h-8"
              disabled
            >
              {t("missions.inProgress")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionItem;
