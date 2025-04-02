
import React from "react";
import { Zap, Pause, Diamond } from "lucide-react";

interface ButtonContentProps {
  miningActive: boolean;
  displayTime: string;
}

/**
 * The content displayed inside the mining button
 */
export const ButtonContent = React.memo<ButtonContentProps>(({ miningActive, displayTime }) => {
  return (
    <div className="relative flex flex-col items-center justify-center z-10">
      {miningActive ? (
        <>
          {/* Active mining state with enhanced styling */}
          <div className="relative mb-1.5 p-1.5">
            <Pause className="h-7 w-7 text-purple-100 animate-pulse-slow" />
            <div className="absolute inset-0 blur-lg bg-purple-700/20 rounded-full -z-10"></div>
          </div>
          
          <span className="text-xs font-mono text-white font-medium tracking-wider bg-darkPurple-900/90 px-2.5 py-1 rounded-md 
                      shadow-inner border border-purple-700/30 transition-all duration-500">
            {displayTime}
          </span>
          
          {/* Enhanced energy particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-5 w-5 rounded-full bg-gradient-to-r from-purple-600/10 to-navy-600/10 animate-pulse-slow"
                 style={{animationDuration: '2.5s'}}></div>
            <div className="absolute h-9 w-9 rounded-full bg-gradient-to-r from-purple-700/5 to-navy-700/5 animate-reverse-spin"
                 style={{animationDuration: '10s'}}></div>
                 
            {/* Floating data fragments */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-float-data"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  "--tx": `${(Math.random() * 40 - 20)}px`,
                  "--ty": `${-(Math.random() * 30 + 20)}px`,
                  opacity: 0.3
                } as React.CSSProperties}
              ></div>
            ))}
          </div>
          
          {/* New! Additional energy effects */}
          <div className="absolute h-full w-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full 
                         bg-gradient-to-r from-navy-700/5 via-purple-600/5 to-navy-700/5 animate-spin-slow"
                 style={{animationDuration: '20s'}}></div>
          </div>
          
          {/* Diamond icon that occasionally flashes to show mining reward */}
          <div className="absolute bottom-[-15px] right-[-15px]">
            <div className="relative">
              <Diamond className="h-4.5 w-4.5 text-purple-500 animate-cosmic-pulse" 
                      style={{animationDuration: '4s', animationDelay: '2s'}} />
              <div className="absolute inset-0 blur-md bg-purple-700/15 rounded-full -z-10"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Inactive state with enhanced design */}
          <div className="relative transition-all duration-500 mb-1">
            <div className="relative group">
              {/* Main icon with enhanced animations */}
              <Zap className="h-8 w-8 text-purple-100 mb-1 animate-cosmic-pulse drop-shadow-md group-hover:text-purple-200" 
                style={{animationDuration: '3s'}} />
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-navy-800/20 blur-lg rounded-full -z-10 transition-all duration-500
                          group-hover:bg-gradient-to-r group-hover:from-purple-700/30 group-hover:to-navy-700/30 group-hover:blur-lg"></div>
              
              {/* New! Multiple animated rings with a more technological feel */}
              <div className="absolute inset-[-4px] rounded-full border border-purple-700/20 opacity-60
                          animate-spin-slow group-hover:border-purple-600/30"></div>
              <div className="absolute inset-[-8px] rounded-full border border-dashed border-navy-700/15 opacity-50
                          animate-reverse-spin"></div>
              <div className="absolute inset-[-12px] rounded-full border border-dotted border-purple-800/10
                          animate-spin-slow" style={{animationDuration: '20s'}}></div>
              
              {/* New! Electronic circuit-like lines */}
              <div className="absolute top-[-3px] left-[-3px] w-3 h-3 border-t border-l border-purple-600/30 rounded-tl-lg"></div>
              <div className="absolute top-[-3px] right-[-3px] w-3 h-3 border-t border-r border-navy-600/30 rounded-tr-lg"></div>
              <div className="absolute bottom-[-3px] left-[-3px] w-3 h-3 border-b border-l border-navy-600/30 rounded-bl-lg"></div>
              <div className="absolute bottom-[-3px] right-[-3px] w-3 h-3 border-b border-r border-purple-600/30 rounded-br-lg"></div>
            </div>
          </div>
          
          {/* Enhanced START text with deeper gradient */}
          <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400
                         bg-clip-text text-transparent bg-size-200 animate-gradient-x transition-all duration-500 pb-0.5">
            START MINING
          </span>
          
          {/* New! Subtle underline */}
          <div className="w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
          
          {/* Enhanced light rays */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-0 left-1/2 w-[1px] h-16 -translate-x-1/2 -translate-y-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-600/15 to-purple-600/20 
                         animate-pulse-slow"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 w-[1px] h-16 -translate-x-1/2 translate-y-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-t from-transparent via-navy-600/15 to-navy-600/20 
                         animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="absolute left-0 top-1/2 h-[1px] w-16 -translate-y-1/2 -translate-x-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-600/15 to-purple-600/20 
                         animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
            </div>
            <div className="absolute right-0 top-1/2 h-[1px] w-16 -translate-y-1/2 translate-x-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-l from-transparent via-navy-600/15 to-navy-600/20 
                         animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ButtonContent.displayName = "ButtonContent";
