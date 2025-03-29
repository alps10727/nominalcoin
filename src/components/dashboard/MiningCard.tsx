
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Circle, Activity } from "lucide-react";
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
    <Card className="mb-6 border-none overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-gray-100">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-[0.03] pointer-events-none"></div>
      
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Zap className="h-5 w-5 text-violet-400" />
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
              {/* Animated rings */}
              <div className={`absolute ${isMobile ? 'w-36 h-36' : 'w-44 h-44'} rounded-full ${
                miningActive 
                  ? 'border-4 border-violet-500/30 border-t-violet-500/80 animate-spin'
                  : 'border-4 border-indigo-500/20 border-t-indigo-500/50'
              }`} style={{ animationDuration: '3s' }}></div>
              
              <div className={`absolute ${isMobile ? 'w-32 h-32' : 'w-40 h-40'} rounded-full ${
                miningActive 
                  ? 'border-4 border-teal-500/30 border-b-teal-500/80 animate-spin'
                  : 'border-4 border-violet-500/20 border-b-violet-500/50'
              }`} style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
              
              {/* Inner pulsing glow effect */}
              <div className={`absolute ${isMobile ? 'w-28 h-28' : 'w-36 h-36'} rounded-full bg-gradient-to-br ${
                miningActive 
                  ? 'from-violet-600/30 to-teal-600/30 animate-pulse'
                  : 'from-indigo-600/20 to-violet-600/20'
              }`} style={{ animationDuration: '2s' }}></div>
              
              {/* The actual button */}
              <button 
                className={`relative ${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                  miningActive 
                    ? 'bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 shadow-lg shadow-violet-900/30' 
                    : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 hover:from-indigo-500 hover:via-indigo-600 hover:to-violet-800 hover:shadow-lg hover:shadow-indigo-900/30'
                }`}
                onClick={miningActive ? onStopMining : onStartMining}
              >
                <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-sm"></div>
                
                <div className="absolute inset-2 rounded-full border border-white/10 flex items-center justify-center">
                  <div className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-full ${
                    miningActive 
                      ? 'bg-gradient-to-br from-violet-500/80 to-indigo-700/80 animate-pulse' 
                      : 'bg-gradient-to-br from-indigo-600/80 to-violet-800/80'
                  } flex items-center justify-center`} style={{ animationDuration: '1.5s' }}>
                    <div className={`${isMobile ? 'w-12 h-12' : 'w-20 h-20'} rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm`}>
                      {miningActive ? (
                        <div className="text-center">
                          <div className="animate-pulse">
                            <Activity className={`${isMobile ? 'h-6 w-6' : 'h-9 w-9'} text-violet-400`} />
                          </div>
                          <span className="text-xs mt-1 font-mono text-violet-300 font-semibold">{formatTime(miningTime)}</span>
                        </div>
                      ) : (
                        <Zap className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-indigo-300`} />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    miningActive 
                      ? 'bg-violet-700/80 text-violet-200 border border-violet-500/30' 
                      : 'bg-indigo-800/80 text-indigo-200 border border-indigo-600/30'
                  }`}>
                    {miningActive ? t('mining.active') : t('mining.inactive')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`flex justify-center text-sm bg-gray-850/60 py-4 ${isMobile ? 'px-4' : 'px-6'} border-t border-indigo-500/20 rounded-b-lg backdrop-blur-sm`}>
        <div className="flex items-center font-medium">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-violet-400" />
            <span>{t('mining.rate')}: <span className="text-violet-300 font-semibold">{miningRate.toFixed(4)} FC/3min</span></span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
