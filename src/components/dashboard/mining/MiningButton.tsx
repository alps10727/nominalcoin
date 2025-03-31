
import React, { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";

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
  const [displayTime, setDisplayTime] = useState("");
  
  // Format and update the displayed time
  useEffect(() => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    setDisplayTime(formatTime(miningTime));
  }, [miningTime]);

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-700 ${
          miningActive ? 'scale-110' : 'scale-100 hover:scale-105'
        }`}
        onClick={onButtonClick}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {/* Enhanced animated background with glow effects for both states */}
        <div className={`absolute inset-0 rounded-full shadow-lg transition-all duration-500 overflow-hidden ${
          miningActive 
            ? 'bg-gradient-to-tr from-indigo-700 via-purple-600 to-darkPurple-800 border-2 border-indigo-400/40 shadow-glow' 
            : 'bg-gradient-to-br from-navy-700 via-darkPurple-800 to-navy-900 border border-indigo-500/30 shadow-md'
        }`}>
          {/* Enhanced shimmering overlay effect for both states */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen"
            style={{ 
              transform: 'translateX(-100%)', 
              animation: miningActive ? 'sheen 2.5s infinite' : 'sheen 5s infinite',
              opacity: miningActive ? 1 : 0.5
            }}>
          </div>
          
          {/* Enhanced animated pulse rings for active state */}
          {miningActive && (
            <>
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulse-slow"></div>
              <div className="absolute -inset-2 rounded-full bg-indigo-500/10 animate-pulse-slow" 
                style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -inset-4 rounded-full bg-indigo-500/5 animate-pulse-slow" 
                style={{animationDelay: '1s'}}></div>
            </>
          )}
          
          {/* Enhanced animated pulse rings for inactive state */}
          {!miningActive && (
            <>
              <div className="absolute inset-0 rounded-full bg-navy-700/20 animate-pulse-slow"
                style={{animationDuration: '4s'}}></div>
              <div className="absolute -inset-2 rounded-full bg-darkPurple-700/10 animate-pulse-slow" 
                style={{animationDuration: '5s'}}></div>
            </>
          )}
        </div>
        
        {/* Inner circle with dynamic animation for both states */}
        <div className={`absolute inset-2 rounded-full transition-all duration-500 ${
          miningActive 
            ? 'bg-gradient-to-br from-darkPurple-900 to-navy-950 opacity-60 scale-95' 
            : 'bg-gradient-to-br from-navy-800 to-darkPurple-950 opacity-70 scale-100'
        }`}></div>
        
        {/* Button content with enhanced animations */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <Pause className="h-8 w-8 text-white mb-2 animate-pulse" style={{animationDuration: '1.5s'}} />
              <span className="text-sm font-mono text-white font-medium tracking-wider bg-darkPurple-900/40 px-2 py-0.5 rounded-md">
                {displayTime}
              </span>
              <span className="text-xs text-indigo-200 mt-1.5 font-semibold animate-pulse tracking-wider">
                MINING
              </span>
            </>
          ) : (
            <>
              <Play className="h-8 w-8 text-white mb-1 animate-cosmic-pulse" style={{animationDuration: '3s'}} />
              <span className="text-sm text-white font-medium mt-1 tracking-wider animate-cosmic-pulse">START</span>
            </>
          )}
        </div>
        
        {/* Enhanced glow effect for both states */}
        <div className={`absolute -inset-1 rounded-full ${
          miningActive 
            ? 'bg-indigo-600/30 blur-sm animate-pulse-slow' 
            : 'bg-navy-800/20 blur-sm animate-pulse-slow'
        }`} style={{animationDuration: miningActive ? '2s' : '4s'}}></div>
        
        <div className={`absolute -inset-px rounded-full ${
          miningActive 
            ? 'bg-gradient-to-r from-indigo-500/40 to-purple-500/40' 
            : 'bg-gradient-to-r from-navy-700/30 to-darkPurple-700/30'
        }`}></div>
        
        {/* Enhanced particle effects for both states */}
        <div className="absolute -inset-8 z-0 overflow-hidden rounded-full">
          {/* Active state particles */}
          {miningActive && (
            <>
              <div className="absolute top-1/2 left-1/4 h-1 w-1 rounded-full bg-indigo-300/80 animate-float-1"></div>
              <div className="absolute top-1/2 right-1/4 h-1 w-1 rounded-full bg-purple-300/80 animate-float-2" 
                style={{animationDelay: '0.7s'}}></div>
              <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-indigo-300/80 animate-float-3" 
                style={{animationDelay: '1.3s'}}></div>
              <div className="absolute top-1/3 right-1/3 h-1 w-1 rounded-full bg-purple-300/80 animate-float-1" 
                style={{animationDelay: '1.7s'}}></div>
            </>
          )}
          
          {/* Enhanced inactive state particles */}
          {!miningActive && (
            <>
              <div className="absolute top-1/2 left-1/3 h-1.5 w-1.5 rounded-full bg-navy-400/70 animate-float-3"
                style={{animationDuration: '5s'}}></div>
              <div className="absolute bottom-1/2 right-1/3 h-1 w-1 rounded-full bg-darkPurple-400/70 animate-float-2" 
                style={{animationDuration: '6s', animationDelay: '1s'}}></div>
              <div className="absolute top-1/3 left-1/2 h-1 w-1 rounded-full bg-navy-400/70 animate-float-1" 
                style={{animationDuration: '7s', animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-1/3 right-1/2 h-1.5 w-1.5 rounded-full bg-darkPurple-400/70 animate-float-3" 
                style={{animationDuration: '5.5s', animationDelay: '1.2s'}}></div>
            </>
          )}
        </div>
        
        {/* Enhanced animated orbit effect for both states with dual rotation */}
        <div className={`absolute inset-0 z-0 ${miningActive ? 'opacity-70' : 'opacity-50'}`}>
          {/* First orbit */}
          <div className={`absolute w-3 h-3 rounded-full ${
            miningActive 
              ? 'bg-indigo-400/30 animate-reverse-spin' 
              : 'bg-navy-400/30 animate-reverse-spin'
          }`} style={{
            top: '10%', 
            left: '10%', 
            transformOrigin: '350% 350%',
            animationDuration: miningActive ? '8s' : '12s'
          }}></div>
          
          {/* Second orbit (spinning in opposite direction) */}
          <div className={`absolute w-2 h-2 rounded-full ${
            miningActive 
              ? 'bg-purple-400/30 animate-spin-slow' 
              : 'bg-darkPurple-400/30 animate-spin-slow'
          }`} style={{
            bottom: '10%', 
            right: '10%', 
            transformOrigin: '-250% -250%',
            animationDuration: miningActive ? '10s' : '14s'
          }}></div>
          
          {/* Third orbit for inactive state (additional spinning element) */}
          {!miningActive && (
            <div className="absolute w-2.5 h-2.5 rounded-full bg-navy-400/20 animate-spin-slow" 
              style={{
                top: '15%', 
                right: '15%', 
                transformOrigin: '-200% 300%',
                animationDuration: '16s'
              }}>
            </div>
          )}
          
          {/* Fourth orbit for inactive state (additional counter-spinning element) */}
          {!miningActive && (
            <div className="absolute w-2 h-2 rounded-full bg-darkPurple-400/20 animate-reverse-spin" 
              style={{
                bottom: '15%', 
                left: '15%', 
                transformOrigin: '300% -200%',
                animationDuration: '18s'
              }}>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
