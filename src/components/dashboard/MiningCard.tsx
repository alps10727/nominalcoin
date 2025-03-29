
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
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6 border-none overflow-hidden shadow-xl transition-all duration-500 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-gray-950"></div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-[0.05] pointer-events-none"></div>
        
        {/* Sparkles effect - enhanced with more particles */}
        {miningActive && (
          <>
            <div className="absolute h-1 w-1 bg-violet-400 rounded-full animate-ping" style={{ top: '15%', left: '10%', animationDuration: '3s', animationDelay: '0.5s' }}></div>
            <div className="absolute h-1 w-1 bg-violet-500 rounded-full animate-ping" style={{ top: '45%', left: '20%', animationDuration: '2.5s', animationDelay: '0.2s' }}></div>
            <div className="absolute h-1 w-1 bg-indigo-400 rounded-full animate-ping" style={{ top: '65%', left: '15%', animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="absolute h-1 w-1 bg-violet-400 rounded-full animate-ping" style={{ top: '20%', right: '25%', animationDuration: '3.5s', animationDelay: '0.7s' }}></div>
            <div className="absolute h-1 w-1 bg-indigo-500 rounded-full animate-ping" style={{ top: '70%', right: '15%', animationDuration: '2.8s', animationDelay: '0.3s' }}></div>
            <div className="absolute h-1 w-1 bg-violet-500 rounded-full animate-ping" style={{ top: '40%', right: '10%', animationDuration: '3.2s', animationDelay: '0.9s' }}></div>
            {/* Additional particles */}
            <div className="absolute h-2 w-2 bg-blue-300 rounded-full animate-ping" style={{ top: '25%', left: '30%', animationDuration: '4.5s', animationDelay: '1.2s' }}></div>
            <div className="absolute h-2 w-2 bg-purple-300 rounded-full animate-ping" style={{ top: '55%', right: '30%', animationDuration: '5s', animationDelay: '0.8s' }}></div>
            <div className="absolute h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" style={{ top: '85%', left: '40%', animationDuration: '3.8s', animationDelay: '0.4s' }}></div>
          </>
        )}
        
        {/* Flowing energy lines when mining is active */}
        {miningActive && (
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-[flow_4s_linear_infinite]"></div>
            <div className="absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent animate-[flow_5s_linear_infinite_reverse]"></div>
            <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-[flow_3.5s_linear_infinite]"></div>
          </div>
        )}
      </div>
      
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
              {/* Outer glowing ring - Enhanced with multiple layers and animations */}
              <div className={`absolute ${isMobile ? 'w-42 h-42' : 'w-52 h-52'} rounded-full bg-gradient-to-r ${
                miningActive 
                  ? 'from-violet-600/30 via-indigo-500/30 to-purple-600/30 animate-pulse'
                  : 'from-indigo-600/20 via-violet-500/20 to-indigo-600/20'
              }`} style={{ animationDuration: '3s' }}></div>
              
              {/* New particle orbit effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                {miningActive && (
                  <>
                    <div className="absolute w-44 h-44 rounded-full border border-violet-500/20 flex items-center justify-center animate-[orbit_8s_linear_infinite]">
                      <div className="absolute w-2 h-2 bg-violet-400 rounded-full"></div>
                    </div>
                    <div className="absolute w-36 h-36 rounded-full border border-indigo-500/20 flex items-center justify-center animate-[orbit_6s_linear_infinite_reverse]">
                      <div className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    </div>
                    <div className="absolute w-48 h-48 rounded-full border border-purple-500/20 flex items-center justify-center animate-[orbit_10s_linear_infinite]">
                      <div className="absolute w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Animated rings with enhanced styling */}
              <div className={`absolute ${isMobile ? 'w-38 h-38' : 'w-48 h-48'} rounded-full ${
                miningActive 
                  ? 'border-[3px] border-violet-600/30 border-t-violet-500/70 animate-spin'
                  : 'border-[3px] border-indigo-600/20 border-t-indigo-500/40'
              }`} style={{ animationDuration: '4s' }}></div>
              
              <div className={`absolute ${isMobile ? 'w-34 h-34' : 'w-44 h-44'} rounded-full ${
                miningActive 
                  ? 'border-[3px] border-indigo-600/30 border-b-indigo-500/70 animate-spin'
                  : 'border-[3px] border-violet-600/20 border-b-violet-500/40'
              }`} style={{ animationDirection: 'reverse', animationDuration: '5s' }}></div>
              
              {/* Inner pulsing glow effect - Enhanced with better gradients */}
              <div className={`absolute ${isMobile ? 'w-30 h-30' : 'w-38 h-38'} rounded-full blur-[20px] ${
                miningActive 
                  ? 'bg-gradient-to-br from-violet-600/40 via-indigo-500/30 to-purple-600/40 animate-pulse'
                  : 'bg-gradient-to-br from-indigo-600/30 via-violet-500/20 to-indigo-600/30'
              }`} style={{ animationDuration: '2s' }}></div>
              
              {/* The actual button - Completely redesigned with hover effects */}
              <button 
                className={`relative ${isMobile ? 'w-28 h-28' : 'w-36 h-36'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 transform hover:scale-105 z-10 overflow-hidden ${
                  miningActive 
                    ? 'bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-800 shadow-lg shadow-violet-900/50' 
                    : 'bg-gradient-to-br from-indigo-700 via-violet-800 to-purple-900 hover:shadow-lg hover:shadow-indigo-900/50'
                }`}
                onClick={miningActive ? onStopMining : onStartMining}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Background with glass effect */}
                <div className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm"></div>
                
                {/* Sheen effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isHovering ? 'animate-[sheen_1s_ease_forwards]' : ''}`}></div>
                
                {/* Button inner container with enhanced gradients */}
                <div className={`absolute inset-2 rounded-full border border-white/20 flex items-center justify-center overflow-hidden ${
                  miningActive ? 'bg-gradient-to-br from-violet-600/90 to-indigo-800/90' : 'bg-gradient-to-br from-indigo-700/90 to-purple-900/90'
                }`}>
                  {/* Animated background for active state */}
                  {miningActive && (
                    <div className="absolute inset-0">
                      {/* Energy waves pulsing outward */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-r from-violet-600/0 via-indigo-500/30 to-violet-600/0 animate-pulse" 
                          style={{ animationDuration: '2s' }}></div>
                      </div>
                      
                      {/* Light reflection on top */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 blur-md"></div>
                      
                      {/* Energy particles rising */}
                      <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div 
                            key={i}
                            className="absolute bottom-0 w-1 h-1 rounded-full bg-white/80"
                            style={{
                              left: `${15 + i * 15}%`,
                              animation: `rise ${3 + i * 0.5}s ease-in infinite`,
                              animationDelay: `${i * 0.5}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Icon and timer with enhanced styling */}
                  <div className="relative flex flex-col items-center justify-center w-full h-full">
                    {miningActive ? (
                      <>
                        <div className="animate-pulse mb-2">
                          <Sparkles className={`${isMobile ? 'h-7 w-7' : 'h-9 w-9'} text-violet-100 filter drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]`} />
                        </div>
                        <span className="text-xs font-mono text-white font-semibold tracking-wider bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                          {formatTime(miningTime)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Zap className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] ${isHovering ? 'animate-[pulse_1s_ease_infinite]' : ''}`} />
                        <span className={`absolute -bottom-1 text-xs text-white/70 font-medium transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                          {t('mining.tap_to_start')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Status indicator with enhanced styling */}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                  <span className={`text-xs font-medium px-5 py-1.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    miningActive 
                      ? 'bg-violet-500/90 text-white border border-violet-400/30 animate-pulse' 
                      : 'bg-indigo-800/90 text-white border border-indigo-500/30'
                  }`} style={{ animationDuration: '3s' }}>
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
