
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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkPurple-800/90 via-darkPurple-900/95 to-navy-900/90"></div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>
      
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {miningActive && (
          <>
            <div className="absolute w-1 h-1 rounded-full bg-darkPurple-300/80 top-1/4 left-1/4 animate-float-1"></div>
            <div className="absolute w-1 h-1 rounded-full bg-darkPurple-400/80 top-3/4 left-1/3 animate-float-2" style={{animationDelay: '1s'}}></div>
            <div className="absolute w-1 h-1 rounded-full bg-navy-300/80 top-2/4 left-2/3 animate-float-3" style={{animationDelay: '0.5s'}}></div>
          </>
        )}
      </div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <Zap className="h-5 w-5 text-darkPurple-300" />
          FC Mining
        </CardTitle>
        <CardDescription className="text-gray-300">
          Mine to earn Future Coin cryptocurrency
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? "px-4 py-2" : ""}`}>
        <div className="text-center mb-6">
          <div className="relative mx-auto">
            {/* Main button container */}
            <div className="relative mx-auto flex items-center justify-center">
              {/* Circles */}
              <div className={`absolute w-52 h-52 rounded-full border border-darkPurple-500/20 ${miningActive ? 'animate-pulse-slow' : ''}`}></div>
              <div className={`absolute w-44 h-44 rounded-full border border-darkPurple-400/30 ${miningActive ? 'animate-reverse-spin' : ''}`} style={{animationDuration: '15s'}}></div>
              <div className={`absolute w-36 h-36 rounded-full border-2 border-darkPurple-400/40 ${miningActive ? 'animate-spin-slow' : ''}`}></div>
              
              {/* The actual button */}
              <button 
                className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden group"
                onClick={miningActive ? onStopMining : onStartMining}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Button background with gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-darkPurple-600 to-navy-700 border-2 border-darkPurple-500/50 group-hover:from-darkPurple-500 group-hover:to-navy-600 transition-all duration-500"></div>
                
                {/* Shine effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isHovering ? 'animate-sheen' : ''}`}></div>
                
                {/* Button inner glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-full bg-darkPurple-500/20 blur-md"></div>
                </div>
                
                {/* Icon and content */}
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  {miningActive ? (
                    <>
                      <div className="mb-2">
                        <Sparkles className="h-6 w-6 text-white animate-pulse" style={{animationDuration: '2s'}} />
                      </div>
                      <span className="text-sm font-mono text-white font-semibold tracking-wider">
                        {formatTime(miningTime)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className={`h-8 w-8 text-white ${isHovering ? 'animate-pulse-slow' : ''}`} />
                      <span className="text-xs mt-1 text-white/80">START</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center text-sm bg-navy-900/80 py-4 border-t border-darkPurple-700/30 rounded-b-lg relative z-10">
        <div className="flex items-center font-medium text-white">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-darkPurple-300" />
            <span>Session: <span className="text-darkPurple-200 font-semibold">{miningSession.toFixed(4)} FC</span></span>
          </div>
        </div>
        
        <div className="flex items-center font-medium text-white">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-darkPurple-300" />
            <span>Rate: <span className="text-darkPurple-200 font-semibold">{miningRate.toFixed(4)} FC/3min</span></span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
