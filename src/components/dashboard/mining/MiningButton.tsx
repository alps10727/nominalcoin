
import React from "react";
import { Play, Pause, Zap } from "lucide-react";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive,
  miningTime, 
  onButtonClick
}) => {
  const [displayTime, setDisplayTime] = React.useState("");
  
  // Format and update the displayed time
  React.useEffect(() => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    setDisplayTime(formatTime(miningTime));
  }, [miningTime]);

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Cosmic energy rings - enhanced with multiple layers */}
      <div className={`absolute w-44 h-44 rounded-full border-2 border-purple-500/40 transition-all duration-700 ${miningActive ? 'opacity-100 animate-pulse scale-110' : 'opacity-0 scale-100'}`} style={{animationDuration: '4s'}}></div>
      <div className={`absolute w-52 h-52 rounded-full border border-indigo-400/30 transition-all duration-700 ${miningActive ? 'opacity-100 animate-pulse scale-110' : 'opacity-0 scale-100'}`} style={{animationDuration: '6s'}}></div>
      <div className={`absolute w-60 h-60 rounded-full border border-indigo-400/10 transition-all duration-700 ${miningActive ? 'opacity-100 animate-pulse scale-110' : 'opacity-0 scale-100'}`} style={{animationDuration: '8s'}}></div>
      
      {/* Orbital particles - enhanced with more particles and better animation */}
      {miningActive && (
        <>
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
              style={{
                transform: `rotate(${i * 30}deg) translateX(85px)`,
                animation: `orbit ${6 + i % 3}s linear infinite`,
                opacity: 0.7 - (i % 3) * 0.2
              }}
            >
              <div className="absolute inset-0 rounded-full bg-white/50 blur-sm"></div>
            </div>
          ))}
        </>
      )}
      
      {/* Enhanced electron particles when active */}
      {miningActive && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {[...Array(8)].map((_, i) => (
            <div 
              key={`electron-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* The main button - enhanced with better gradients and effects */}
      <button 
        className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-700 ${miningActive ? 'scale-110' : 'scale-100 hover:scale-105'}`}
        onClick={onButtonClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Button background with enhanced gradient and lighting effects */}
        <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
          miningActive 
            ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 border-2 border-purple-400/50 shadow-[0_0_30px_rgba(129,140,248,0.6)]' 
            : 'bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-900 border-2 border-indigo-400/20 shadow-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'
        }`}></div>
        
        {/* Inner circle with animated gradient */}
        <div className={`absolute inset-4 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-950/30 animate-pulse ${miningActive ? 'opacity-100' : 'opacity-70'}`} style={{animationDuration: '3s'}}></div>
        
        {/* Cosmic core pulse effect - only visible when active */}
        {miningActive && (
          <div className="absolute inset-10 rounded-full bg-white/5 animate-pulse" style={{animationDuration: '1.5s'}}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-md"></div>
          </div>
        )}
        
        {/* Sheen lighting effect - enhanced */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className={`absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform ${miningActive ? 'animate-sheen' : ''}`} style={{animationDuration: '2s', animationIterationCount: 'infinite'}}></div>
        </div>
        
        {/* Button content - enhanced with better icons and text */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <Pause className="h-8 w-8 text-white" />
                  <div className="absolute -inset-3 bg-indigo-500/20 rounded-full blur-md animate-pulse" style={{animationDuration: '2s'}}></div>
                </div>
                <span className="text-base font-mono text-white font-semibold tracking-wider">
                  {displayTime}
                </span>
                <span className="text-xs text-indigo-200 mt-1 tracking-widest font-semibold animate-pulse" style={{animationDuration: '2s'}}>MINING</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <div className="relative mb-1 group">
                  <Zap className="h-10 w-10 text-white group-hover:text-indigo-200 transition-colors duration-300" />
                  <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-ping opacity-75" style={{animationDuration: '1.5s'}}></div>
                </div>
                <span className="text-sm mt-2 text-white font-medium tracking-wider group-hover:text-indigo-200 transition-colors duration-300">START</span>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
