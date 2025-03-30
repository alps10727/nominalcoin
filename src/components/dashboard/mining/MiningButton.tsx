
import React, { useState, useEffect } from "react";
import { Sparkles, Play, Pause } from "lucide-react";

interface MiningButtonProps {
  miningActive: boolean;
  miningTime: number;
  onButtonClick: () => void;
}

/**
 * Component that renders the mining button with all its visual effects
 */
export const MiningButton: React.FC<MiningButtonProps> = ({ 
  miningActive,
  miningTime, 
  onButtonClick
}) => {
  const [isHovering, setIsHovering] = useState(false);
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

  // Kullanıcının tıklama işleyicisi
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onButtonClick();
  };

  return (
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
        onClick={handleClick}
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
              {/* Timer display for active state */}
              <div className="flex flex-col items-center">
                <Pause className="h-6 w-6 text-white mb-1" />
                <span className="text-sm font-mono text-white font-semibold tracking-wider">
                  {displayTime}
                </span>
              </div>
            </>
          ) : (
            <>
              <Play className={`h-8 w-8 text-white ${isHovering ? 'animate-pulse-slow' : ''}`} />
              <span className="text-xs mt-1 text-white/80 gradient-text">START</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
