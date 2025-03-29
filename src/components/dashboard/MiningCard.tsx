import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, Circle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MiningCardProps {
  miningActive: boolean;
  progress: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
  onStartMining: () => void;
  onStopMining: () => void;
}

const MiningCard = ({
  miningActive,
  progress,
  miningRate,
  miningSession,
  miningTime,
  onStartMining,
  onStopMining
}: MiningCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const formatTime = (seconds: number) => {
    // 6 saatlik bir periyot için daha uygun bir format
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow bg-gray-800 text-gray-100 dark:bg-gray-850">
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-5 w-5 text-yellow-400" />
          {t('mining.title')}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {t('mining.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 py-2" : ""}>
        <div className="text-center mb-6">
          <div 
            className={`relative mx-auto ${isMobile ? 'w-36 h-36' : 'w-44 h-44'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              miningActive 
                ? 'bg-gradient-to-br from-green-900 to-emerald-800 shadow-lg shadow-green-900/50' 
                : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-md'
            }`}
            onClick={miningActive ? onStopMining : onStartMining}
          >
            <Circle className={`${isMobile ? 'h-28 w-28' : 'h-36 w-36'} ${
              miningActive 
                ? 'text-green-400 animate-pulse' 
                : 'text-gray-500 hover:text-indigo-400 transition-colors'
            }`} />
            
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              {miningActive ? (
                <>
                  <span className="text-sm font-semibold bg-gray-900/80 px-3 py-1 rounded-full shadow-sm text-green-400">{t('mining.active')}</span>
                  <span className="text-xs mt-2 font-mono bg-gray-900/80 px-2 py-1 rounded-md text-green-400">{formatTime(miningTime)}</span>
                </>
              ) : (
                <span className="text-sm font-semibold bg-indigo-700 px-4 py-1.5 rounded-full shadow-sm text-white">{t('mining.inactive')}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link to="/mining/upgrades">
            <Button variant="outline" className="border-indigo-800 bg-gray-800/50 text-indigo-300 hover:bg-indigo-900/30">
              {t('mining.upgrades')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
      <CardFooter className={`flex justify-between text-sm text-gray-400 bg-gray-850 py-4 ${isMobile ? 'px-4' : 'px-6'} border-t border-gray-700`}>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-indigo-400" />
          <span>{t('mining.activeminers')}</span>
        </div>
        <div className="flex items-center font-medium">
          <span>{t('mining.rate')}: {miningRate.toFixed(4)} FC/30s</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
