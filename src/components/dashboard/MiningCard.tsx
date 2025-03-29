
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
      {/* Background color */}
      <div className="absolute inset-0 bg-purple-900"></div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <Zap className="h-5 w-5 text-violet-300" />
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
              {/* Outer circle */}
              <div className="absolute w-52 h-52 rounded-full border border-purple-500/30"></div>
              
              {/* Middle circle */}
              <div className="absolute w-44 h-44 rounded-full border border-purple-400/40"></div>
              
              {/* Inner circle with animation */}
              <div className={`absolute w-36 h-36 rounded-full border-2 border-purple-400/50 ${
                miningActive 
                  ? 'animate-spin' 
                  : ''
              }`} style={{ animationDuration: '12s' }}></div>
              
              {/* Small decorative dots */}
              <div className="absolute w-52 h-52 rounded-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-300 rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 bg-purple-300 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-300 rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 bg-purple-300 rounded-full"></div>
              </div>
              
              {/* The actual button */}
              <button 
                className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 z-10 overflow-hidden"
                onClick={miningActive ? onStopMining : onStartMining}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Button background */}
                <div className="absolute inset-0 rounded-full bg-purple-700 border-2 border-purple-500"></div>
                
                {/* Button inner content */}
                <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center overflow-hidden">
                  {/* Animated shine effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent -translate-x-full ${isHovering ? 'animate-[sheen_1s_ease_forwards]' : ''}`}></div>
                  
                  {/* Icon and timer */}
                  <div className="relative flex flex-col items-center justify-center w-full h-full">
                    {miningActive ? (
                      <>
                        <div className="mb-2">
                          <Sparkles className="h-6 w-6 text-white/90 animate-pulse" style={{ animationDuration: '2s' }} />
                        </div>
                        <span className="text-sm font-mono text-white font-semibold tracking-wider">
                          {formatTime(miningTime)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles 
                          className={`h-8 w-8 text-white/90 ${isHovering ? 'animate-[pulse_1s_ease_infinite]' : ''}`} 
                        />
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center text-sm bg-purple-900/90 py-4 border-t border-purple-700/30 rounded-b-lg relative z-10">
        <div className="flex items-center font-medium text-white">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-300" />
            <span>Rate: <span className="text-purple-200 font-semibold">{miningRate.toFixed(4)} FC/3min</span></span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MiningCard;
