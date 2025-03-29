
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Circle, Activity, Sparkles } from "lucide-react";
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
    <Card className="mb-6 border-none overflow-hidden shadow-xl transition-all duration-500 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-gray-950"></div>
      
      {/* Sparkles background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {miningActive && (
          <>
            <div className="absolute h-1 w-1 bg-violet-400 rounded-full animate-ping" style={{ top: '15%', left: '10%', animationDuration: '3s', animationDelay: '0.5s' }}></div>
            <div className="absolute h-1 w-1 bg-violet-500 rounded-full animate-ping" style={{ top: '45%', left: '20%', animationDuration: '2.5s', animationDelay: '0.2s' }}></div>
            <div className="absolute h-1 w-1 bg-indigo-400 rounded-full animate-ping" style={{ top: '65%', left: '15%', animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="absolute h-1 w-1 bg-violet-400 rounded-full animate-ping" style={{ top: '20%', right: '25%', animationDuration: '3.5s', animationDelay: '0.7s' }}></div>
            <div className="absolute h-1 w-1 bg-indigo-500 rounded-full animate-ping" style={{ top: '70%', right: '15%', animationDuration: '2.8s', animationDelay: '0.3s' }}></div>
            <div className="absolute h-1 w-1 bg-violet-500 rounded-full animate-ping" style={{ top: '40%', right: '10%', animationDuration: '3.2s', animationDelay: '0.9s' }}></div>
          </>
        )}
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-[0.05] pointer-events-none"></div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""}`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <Zap className="h-5 w-5 text-violet-400" />
          {t('mining.title')}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {t('mining.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-2" : ""}`}>
        <div className="text-center mb-6">
          <div className="relative mx-auto">
            {/* Main button container */}
            <div className="relative mx-auto flex items-center justify-center">
              {/* Outer glowing ring */}
              <div className={`absolute ${isMobile ? 'w-40 h-40' : 'w-48 h-48'} rounded-full bg-gradient-to-r ${
                miningActive 
                  ? 'from-violet-600/20 via-indigo-500/20 to-purple-600/20 animate-pulse'
                  : 'from-indigo-600/10 via-violet-500/10 to-indigo-600/10'
              }`} style={{ animationDuration: '3s' }}></div>
              
              {/* Animated rings */}
              <div className={`absolute ${isMobile ? 'w-36 h-36' : 'w-44 h-44'} rounded-full ${
                miningActive 
                  ? 'border-[3px] border-violet-600/20 border-t-violet-500/60 animate-spin'
                  : 'border-[3px] border-indigo-600/20 border-t-indigo-500/40'
              }`} style={{ animationDuration: '4s' }}></div>
              
              <div className={`absolute ${isMobile ? 'w-32 h-32' : 'w-40 h-40'} rounded-full ${
                miningActive 
                  ? 'border-[3px] border-indigo-600/20 border-b-indigo-500/60 animate-spin'
                  : 'border-[3px] border-violet-600/20 border-b-violet-500/40'
              }`} style={{ animationDirection: 'reverse', animationDuration: '5s' }}></div>
              
              {/* Inner pulsing glow effect */}
              <div className={`absolute ${isMobile ? 'w-28 h-28' : 'w-36 h-36'} rounded-full blur-[20px] ${
                miningActive 
                  ? 'bg-gradient-to-br from-violet-600/30 via-indigo-500/20 to-purple-600/30 animate-pulse'
                  : 'bg-gradient-to-br from-indigo-600/20 via-violet-500/10 to-indigo-600/20'
              }`} style={{ animationDuration: '2s' }}></div>
              
              {/* The actual button */}
              <button 
                className={`relative ${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 transform hover:scale-105 z-10 ${
                  miningActive 
                    ? 'bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 shadow-lg shadow-violet-900/50' 
                    : 'bg-gradient-to-br from-indigo-700 via-violet-800 to-purple-900 hover:from-indigo-600 hover:via-violet-700 hover:to-purple-800 hover:shadow-lg hover:shadow-indigo-900/50'
                }`}
                onClick={miningActive ? onStopMining : onStartMining}
              >
                <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm"></div>
                
                <div className={`absolute inset-2 rounded-full border border-white/10 flex items-center justify-center overflow-hidden ${
                  miningActive ? 'bg-gradient-to-br from-violet-600/80 to-indigo-800/80' : 'bg-gradient-to-br from-indigo-700/80 to-purple-900/80'
                }`}>
                  {/* Animated background for active state */}
                  {miningActive && (
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-indigo-500/30 to-purple-600/30 animate-pulse" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 blur-md"></div>
                    </div>
                  )}
                  
                  {/* Icon and timer */}
                  <div className="relative flex flex-col items-center justify-center w-full h-full">
                    {miningActive ? (
                      <>
                        <div className="animate-pulse mb-1">
                          <Sparkles className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-violet-300`} />
                        </div>
                        <span className="text-xs font-mono text-white font-semibold tracking-wider bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">{formatTime(miningTime)}</span>
                      </>
                    ) : (
                      <Zap className={`${isMobile ? 'h-10 w-10' : 'h-14 w-14'} text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
                    )}
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                  <span className={`text-xs font-medium px-4 py-1 rounded-full shadow-lg backdrop-blur-sm ${
                    miningActive 
                      ? 'bg-violet-600/90 text-white border border-violet-500/30' 
                      : 'bg-indigo-800/90 text-white border border-indigo-600/30'
                  }`}>
                    {miningActive ? t('mining.active') : t('mining.inactive')}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`flex justify-center text-sm bg-gray-950/90 py-4 ${isMobile ? 'px-4' : 'px-6'} border-t border-violet-500/20 rounded-b-lg backdrop-blur-md relative z-10`}>
        <div className="flex items-center font-medium text-white">
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
