
import React, { useState, useEffect } from "react";
import { Play, Pause, Cpu } from "lucide-react";

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

  // Prevent default and stop propagation to avoid double-clicks
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onButtonClick();
  };

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Energy field simulation */}
      <div className={`absolute w-40 h-40 rounded-full border border-cyan-500/30 transition-all duration-500 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-48 h-48 rounded-full border border-blue-400/20 transition-all duration-700 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      <div className={`absolute w-56 h-56 rounded-full border border-indigo-500/10 transition-all duration-900 ${miningActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}></div>
      
      {/* Dynamic effects that only appear when active */}
      {miningActive && (
        <>
          <div className="absolute w-64 h-64 rounded-full animate-ping-slow opacity-10 border border-cyan-400/50"></div>
          <div className="absolute inset-0 w-40 h-40 mx-auto my-auto">
            <div className="absolute inset-0 bg-cyan-500/5 rounded-full animate-pulse-slow"></div>
          </div>
          
          {/* Data stream particles */}
          <div className="absolute w-full h-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full animate-particle-trace"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.2}s`,
                  transform: `rotate(${i * 45}deg) translateX(${20 + Math.random() * 20}px)`
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* The main button */}
      <button 
        className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer z-10 overflow-hidden transition-all duration-500 group ${miningActive ? 'scale-105' : 'scale-100'}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Button background with techno gradient */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${miningActive 
          ? 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 border-2 border-cyan-400/50' 
          : 'bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900 border-2 border-blue-500/30'
        } group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]`}></div>
        
        {/* Inner circle texture */}
        <div className="absolute inset-3 rounded-full border border-blue-300/10"></div>
        <div className="absolute inset-6 rounded-full border border-cyan-300/10"></div>
        
        {/* Center CPU icon that shows when inactive */}
        {!miningActive && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Cpu className="w-12 h-12 text-blue-200" />
          </div>
        )}
        
        {/* Pulsing highlight effect */}
        <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/10 to-transparent opacity-0 ${isHovering ? 'animate-pulse-gradient opacity-100' : ''}`}></div>
        
        {/* Button content */}
        <div className="relative flex flex-col items-center justify-center z-10">
          {miningActive ? (
            <>
              <div className="flex flex-col items-center">
                <Pause className="h-6 w-6 text-cyan-100 mb-1" />
                <span className="text-sm font-mono text-cyan-100 font-semibold tracking-wider">
                  {displayTime}
                </span>
              </div>
            </>
          ) : (
            <>
              <Play className={`h-8 w-8 text-blue-100 ${isHovering ? 'animate-pulse' : ''}`} />
              <span className="text-xs mt-1 text-cyan-100 font-medium">INITIALIZE</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
