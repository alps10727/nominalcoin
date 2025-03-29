
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
    <Card className="mb-6 border-none shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-50"></div>
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : ''}`}>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-5 w-5 text-yellow-300" />
          {t('mining.title')}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {t('mining.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 py-2' : ''}`}>
        <div className="text-center mb-6">
          <div className="flex justify-center items-center">
            <div className="relative inline-flex justify-center items-center">
              {/* Spinning ring animation */}
              <div 
                className="absolute rounded-full border-4 border-indigo-500/30 border-t-indigo-500/80" 
                style={{
                  width: isMobile ? '140px' : '170px',
                  height: isMobile ? '140px' : '170px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'spin 1.5s linear infinite'
                }}
              ></div>
              
              {/* Mining start/stop button */}
              <button 
                className={`relative ${isMobile ? 'w-32 h-32' : 'w-40 h-40'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  miningActive 
                    ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg shadow-emerald-900/50' 
                    : 'bg-gradient-to-br from-gray-700 to-gray-900 hover:from-indigo-700 hover:to-indigo-900 hover:shadow-lg hover:shadow-indigo-900/30'
                }`}
                onClick={miningActive ? onStopMining : onStartMining}
              >
                <Circle className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} ${
                  miningActive 
                    ? 'text-emerald-300 animate-pulse' 
                    : 'text-gray-400 hover:text-indigo-300 transition-colors'
                }`} />
                
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  {miningActive ? (
                    <>
                      <span className="text-sm font-semibold bg-gray-900/80 px-3 py-1 rounded-full shadow-md text-emerald-300">{t('mining.active')}</span>
                      <span className="text-xs mt-2 font-mono bg-gray-900/80 px-2 py-1 rounded-md text-emerald-300">{formatTime(miningTime)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold bg-indigo-700/90 px-4 py-1.5 rounded-full shadow-md text-white">{t('mining.inactive')}</span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className={`flex justify-center text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm py-4 ${isMobile ? 'px-4' : 'px-6'} border-t border-gray-700/50 relative z-10`}>
        <div className="flex items-center font-medium">
          <span>{t('mining.rate')}: <span className="text-indigo-300">{miningRate.toFixed(4)} FC/3min</span></span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
