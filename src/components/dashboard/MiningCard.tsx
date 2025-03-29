
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
  const [isHovering, setIsHovering] = useState(false);

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
            <div 
              className="relative inline-flex justify-center items-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Outer ripple effect when active */}
              {miningActive && (
                <div 
                  className="absolute rounded-full bg-gradient-to-br from-cyan-400/30 to-emerald-500/30"
                  style={{
                    width: isMobile ? '170px' : '200px',
                    height: isMobile ? '170px' : '200px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple 3s ease-out infinite'
                  }}
                ></div>
              )}
              
              {/* First spinning ring animation */}
              <div 
                className="absolute rounded-full border-[3px]"
                style={{
                  width: isMobile ? '140px' : '170px',
                  height: isMobile ? '140px' : '170px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'spin 1.5s linear infinite',
                  borderColor: miningActive 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : isHovering ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)',
                  borderTopColor: miningActive 
                    ? 'rgba(16, 185, 129, 0.8)' 
                    : isHovering ? 'rgba(99, 102, 241, 0.9)' : 'rgba(99, 102, 241, 0.6)'
                }}
              ></div>
              
              {/* Second spinning ring (opposite direction) */}
              <div 
                className="absolute rounded-full border-[2px]"
                style={{
                  width: isMobile ? '155px' : '185px',
                  height: isMobile ? '155px' : '185px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'spin-reverse 3s linear infinite',
                  borderColor: 'transparent',
                  borderLeftColor: miningActive 
                    ? 'rgba(16, 185, 129, 0.4)' 
                    : isHovering ? 'rgba(168, 85, 247, 0.5)' : 'rgba(168, 85, 247, 0.3)'
                }}
              ></div>
              
              {/* Mining start/stop button */}
              <button 
                className={`relative ${isMobile ? 'w-28 h-28' : 'w-40 h-40'} rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden shadow-lg`}
                onClick={miningActive ? onStopMining : onStartMining}
                style={{
                  transform: isHovering && !miningActive ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: miningActive 
                    ? '0 0 25px rgba(6, 182, 212, 0.6)' 
                    : isHovering ? '0 0 20px rgba(99, 102, 241, 0.5)' : '0 0 15px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Button background with gradient */}
                <div className={`absolute inset-0 ${
                  miningActive 
                    ? 'bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700' 
                    : 'bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-900'
                } transition-all duration-500`}></div>
                
                {/* Glowing dots effect */}
                <div 
                  className={`absolute inset-0 ${miningActive || isHovering ? 'bg-dot-white opacity-40' : 'opacity-0'}`}
                  style={{
                    animation: isHovering || miningActive ? 'pulse 4s ease-in-out infinite' : 'none'
                  }}
                ></div>
                
                {/* Button center icon */}
                {miningActive ? (
                  <div className="relative z-10 animate-pulse-slow">
                    <Circle className={`${isMobile ? 'h-20 w-20' : 'h-32 w-32'} text-cyan-200 opacity-90`} />
                  </div>
                ) : (
                  <Circle className={`${isMobile ? 'h-20 w-20' : 'h-32 w-32'} relative z-10 transition-all duration-300 text-indigo-200 ${isHovering ? 'scale-110' : 'scale-100'}`} />
                )}
                
                {/* Status labels */}
                <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                  {miningActive ? (
                    <>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm shadow-md text-cyan-300 transition-all duration-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>{t('mining.active')}</span>
                      <span className={`${isMobile ? 'text-xs mt-1' : 'text-xs mt-2'} font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md text-cyan-300 transition-all duration-300`}>{formatTime(miningTime)}</span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center transition-transform duration-300" style={{ transform: isHovering ? 'translateY(-2px)' : 'translateY(0)' }}>
                      <span className={`${isMobile ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1.5'} font-medium rounded-full bg-black/40 backdrop-blur-sm shadow-md text-white`}>{t('mining.inactive')}</span>
                      {isHovering && (
                        <span className={`${isMobile ? 'text-[10px] mt-1' : 'text-xs mt-1.5'} text-indigo-200 opacity-80`}>
                          {t('mining.tap_to_start')}
                        </span>
                      )}
                    </div>
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
