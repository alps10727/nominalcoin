
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity, Sparkles, Gem } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { isDarkMode } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, delay: number, speed: number, x: number, size: number}>>([]);
  
  // Generate random particles when mining is active
  useEffect(() => {
    if (miningActive) {
      const newParticles = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 5,
        speed: 3 + Math.random() * 3,
        x: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [miningActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6 border border-darkPurple-700/30 overflow-hidden shadow-xl transition-all duration-500 relative group">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkPurple-800/95 via-navy-900/98 to-darkPurple-900/95"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>
      
      {/* Subtle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-darkPurple-300/80 animate-float-1"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              bottom: '10%',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
      </div>
      
      <CardHeader className={`relative z-10 ${isMobile ? "px-4 py-3" : ""} text-white`}>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
          <Gem className="h-5 w-5 text-darkPurple-300" />
          <span className="text-shadow">FC Mining</span>
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
              {/* Orbital rings with double rotation */}
              <div className={`absolute w-52 h-52 rounded-full border border-darkPurple-500/20 ${miningActive ? 'animate-spin-slow' : ''}`}></div>
              <div className={`absolute w-44 h-44 rounded-full border border-darkPurple-400/30 ${miningActive ? 'animate-reverse-spin' : ''}`} style={{animationDuration: '12s'}}></div>
              <div className={`absolute w-36 h-36 rounded-full border-2 border-darkPurple-400/40 ${miningActive ? 'animate-spin-slow' : ''}`} style={{animationDuration: '8s'}}></div>
              
              {/* Double rotating rings when active */}
              {miningActive && (
                <>
                  <div className="absolute w-60 h-60 rounded-full">
                    <div className="absolute w-full h-full border border-darkPurple-300/20 rounded-full animate-spin-slow" style={{animationDuration: '15s'}}></div>
                    <div className="absolute w-full h-full border border-darkPurple-400/10 rounded-full animate-reverse-spin" style={{animationDuration: '20s'}}></div>
                  </div>
                  <div className="absolute w-28 h-28 rounded-full">
                    <div className="absolute w-full h-full border border-darkPurple-300/30 rounded-full animate-spin-slow" style={{animationDuration: '6s'}}></div>
                    <div className="absolute w-full h-full border border-darkPurple-400/20 rounded-full animate-reverse-spin" style={{animationDuration: '4s'}}></div>
                  </div>
                </>
              )}
              
              {/* The actual button */}
              <button 
                className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden group"
                onClick={miningActive ? onStopMining : onStartMining}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Button background with gradient */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-darkPurple-600 to-navy-800 border-2 border-darkPurple-500/50 group-hover:from-darkPurple-500 group-hover:to-navy-700 transition-all duration-500 shadow-glow"></div>
                
                {/* Rotating inner circle */}
                <div className={`absolute inset-2 rounded-full border border-darkPurple-400/30 ${miningActive ? 'animate-spin-slow' : ''}`} style={{animationDuration: '10s'}}></div>
                <div className={`absolute inset-4 rounded-full border border-darkPurple-300/20 ${miningActive ? 'animate-reverse-spin' : ''}`} style={{animationDuration: '7s'}}></div>
                
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
                      {/* Double rotating icons for active state */}
                      <div className="relative h-12 w-12">
                        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow" style={{animationDuration: '8s'}}>
                          <div className="h-1.5 w-1.5 rounded-full bg-darkPurple-300 absolute" style={{top: '0', left: '50%', transform: 'translateX(-50%)'}}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center animate-reverse-spin" style={{animationDuration: '6s'}}>
                          <div className="h-1 w-1 rounded-full bg-indigo-400 absolute" style={{bottom: '0', left: '50%', transform: 'translateX(-50%)'}}></div>
                        </div>
                      </div>
                      <span className="text-sm font-mono text-white font-semibold tracking-wider mt-1">
                        {formatTime(miningTime)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className={`h-8 w-8 text-white ${isHovering ? 'animate-pulse-slow' : ''}`} />
                      <span className="text-xs mt-1 text-white/80 gradient-text">START</span>
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
