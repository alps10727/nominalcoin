
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

  // Prevent default and stop propagation to avoid double-clicks
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onButtonClick();
  };

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Cosmic energy rings */}
      <div className={`absolute w-44 h-44 rounded-full border-2 border-purple-500/30 transition-all duration-700 ${miningActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} style={{animationDuration: '4s'}}></div>
      <div className={`absolute w-52 h-52 rounded-full border border-indigo-400/20 transition-all duration-700 ${miningActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} style={{animationDuration: '6s'}}></div>
      
      {/* Orbital particles - only visible when mining is active */}
      {miningActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-purple-400/70"
              style={{
                transform: `rotate(${i * 45}deg) translateX(80px)`,
                animation: `orbit 6s linear infinite`
              }}
            ></div>
          ))}
        </>
      )}
      
      {/* The main button */}
      <button 
        className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-700 ${miningActive ? 'scale-110' : 'scale-100'}`}
        onClick={handleClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Button background with advanced gradient and lighting effects */}
        <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
          miningActive 
            ? 'bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 border-2 border-purple-400/50 shadow-[0_0_30px_rgba(129,140,248,0.6)]' 
            : 'bg-gradient-to-br from-indigo-800 via-purple-900 to-indigo-950 border-2 border-indigo-400/30'
        }`}></div>
        
        {/* Inner circle with animated gradient */}
        <div className={`absolute inset-3 rounded-full bg-gradient-to-br from-purple-800/40 to-indigo-900/30 animate-pulse opacity-70 ${miningActive ? 'opacity-100' : 'opacity-60'}`} style={{animationDuration: '3s'}}></div>
        
        {/* Sheen lighting effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className={`absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform ${miningActive ? 'animate-sheen' : ''}`} style={{animationDuration: '2s', animationIterationCount: 'infinite'}}></div>
        </div>
        
        {/* Button content */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <Pause className="h-8 w-8 text-white" />
                  <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-sm animate-pulse" style={{animationDuration: '2s'}}></div>
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
                <div className="relative mb-1">
                  <Zap className="h-10 w-10 text-white" />
                  <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-ping opacity-75" style={{animationDuration: '1.5s'}}></div>
                </div>
                <span className="text-sm mt-2 text-white font-medium tracking-wider">START</span>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
