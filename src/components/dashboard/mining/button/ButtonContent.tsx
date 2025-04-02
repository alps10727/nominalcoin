
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
          {/* Active mining state with enhanced styling and darker theme */}
          <div className="relative">
            <Pause className="h-7 w-7 text-white mb-1 animate-pulse-slow" />
            <div className="absolute inset-0 blur-lg bg-purple-800/15 rounded-full -z-10"></div>
          </div>
          
          <span className="text-xs font-mono text-white font-medium tracking-wider bg-darkPurple-950/90 px-2 py-0.5 rounded-md 
                      shadow-inner border border-purple-800/20 transition-all duration-500">
            {displayTime}
          </span>
          
          {/* Enhanced energy particles with deeper colors */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-4 w-4 rounded-full bg-gradient-to-r from-purple-700/5 to-navy-700/5 animate-pulse-slow"
                 style={{animationDuration: '2.5s'}}></div>
            <div className="absolute h-8 w-8 rounded-full bg-gradient-to-r from-purple-800/3 to-navy-800/3 animate-reverse-spin"
                 style={{animationDuration: '10s'}}></div>
                 
            {/* Floating data fragments with richer colors */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-purple-600 rounded-full animate-float-data"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  "--tx": `${(Math.random() * 40 - 20)}px`,
                  "--ty": `${-(Math.random() * 30 + 20)}px`,
                  opacity: 0.2
                } as React.CSSProperties}
              ></div>
            ))}
          </div>
          
          {/* Diamond icon that occasionally flashes to show mining reward with deeper color */}
          <div className="absolute bottom-[-15px] right-[-15px]">
            <div className="relative">
              <Diamond className="h-4 w-4 text-purple-600 animate-cosmic-pulse" 
                      style={{animationDuration: '4s', animationDelay: '2s'}} />
              <div className="absolute inset-0 blur-md bg-purple-800/10 rounded-full -z-10"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Enhanced inactive state with deeper more mysterious theme */}
          <div className="relative transition-all duration-500">
            <div className="relative group">
              {/* Main icon with enhanced animations */}
              <Zap className="h-8 w-8 text-white mb-1 animate-cosmic-pulse drop-shadow-md group-hover:text-purple-200" 
                style={{animationDuration: '3s'}} />
              
              {/* Enhanced glow effect with deeper colors */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/15 to-navy-900/15 blur-md rounded-full -z-10 transition-all duration-500
                          group-hover:bg-gradient-to-r group-hover:from-purple-800/20 group-hover:to-navy-800/20 group-hover:blur-lg"></div>
              
              {/* Multiple animated rings with deeper colors */}
              <div className="absolute inset-[-4px] rounded-full border border-purple-800/15 opacity-60
                          animate-spin-slow group-hover:border-purple-700/25"></div>
              <div className="absolute inset-[-8px] rounded-full border border-dashed border-navy-800/10 opacity-40
                          animate-reverse-spin"></div>
              <div className="absolute inset-[-12px] rounded-full border border-dotted border-purple-900/5
                          animate-spin-slow" style={{animationDuration: '20s'}}></div>
            </div>
          </div>
          
          {/* Enhanced START text with deeper gradient */}
          <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600
                         bg-clip-text text-transparent bg-size-200 animate-gradient-x transition-all duration-500">
            START MINING
          </span>
          
          {/* Enhanced light rays with deeper, more subtle colors */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-0 left-1/2 w-[1px] h-16 -translate-x-1/2 -translate-y-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-700/10 to-purple-700/15 
                         animate-pulse-slow"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 w-[1px] h-16 -translate-x-1/2 translate-y-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-t from-transparent via-navy-700/10 to-navy-700/15 
                         animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="absolute left-0 top-1/2 h-[1px] w-16 -translate-y-1/2 -translate-x-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-700/10 to-purple-700/15 
                         animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
            </div>
            <div className="absolute right-0 top-1/2 h-[1px] w-16 -translate-y-1/2 translate-x-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-l from-transparent via-navy-700/10 to-navy-700/15 
                         animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ButtonContent.displayName = "ButtonContent";
