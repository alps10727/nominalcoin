
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Circle, Loader } from "lucide-react";
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
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-800 via-gray-850 to-indigo-950 text-gray-100">
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Zap className="h-5 w-5 text-yellow-400" />
          {t('mining.title')}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {t('mining.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 py-2" : ""}>
        <div className="text-center mb-6">
          <div className="relative mx-auto">
            {/* Main button container */}
            <div className="relative mx-auto flex items-center justify-center">
              {/* Dual spinning rings - kept as requested */}
              <div className={`absolute ${isMobile ? 'w-36 h-36' : 'w-44 h-44'} rounded-full border-4 border-indigo-500/30 border-t-indigo-500/80 animate-spin`}></div>
              
              {/* Inner pulsing glow effect */}
              <div className={`absolute ${isMobile ? 'w-32 h-32' : 'w-40 h-40'} rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 animate-pulse`}></div>
              
              {/* The actual button */}
              <div 
                className={`relative ${isMobile ? 'w-28 h-28' : 'w-36 h-36'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  miningActive 
                    ? 'bg-gradient-to-br from-emerald-700 to-teal-900 shadow-lg shadow-emerald-900/30' 
                    : 'bg-gradient-to-br from-indigo-800 to-purple-900 hover:from-indigo-700 hover:to-purple-800 hover:shadow-lg hover:shadow-indigo-900/30'
                }`}
                onClick={miningActive ? onStopMining : onStartMining}
              >
                <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`${isMobile ? 'w-20 h-20' : 'w-28 h-28'} rounded-full ${
                    miningActive 
                      ? 'bg-gradient-to-br from-emerald-500/80 to-teal-700/80 animate-pulse' 
                      : 'bg-gradient-to-br from-indigo-600/80 to-purple-800/80 hover:from-indigo-500/80 hover:to-purple-700/80'
                  } flex items-center justify-center`}>
                    <div className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm`}>
                      {miningActive ? (
                        <div className="text-center">
                          <div className="animate-pulse">
                            <Circle className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} text-emerald-400`} />
                          </div>
                          <span className="text-xs mt-1 font-mono text-emerald-400 font-semibold">{formatTime(miningTime)}</span>
                        </div>
                      ) : (
                        <Zap className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-indigo-300`} />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    miningActive 
                      ? 'bg-emerald-900/80 text-emerald-300' 
                      : 'bg-indigo-900/80 text-indigo-300'
                  }`}>
                    {miningActive ? t('mining.active') : t('mining.inactive')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`flex justify-center text-sm bg-gray-850/80 py-4 ${isMobile ? 'px-4' : 'px-6'} border-t border-gray-700/50 rounded-b-lg backdrop-blur-sm`}>
        <div className="flex items-center font-medium">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>{t('mining.rate')}: <span className="text-yellow-300 font-semibold">{miningRate.toFixed(4)} FC/3min</span></span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
