
import React from "react";

interface PulseRingsProps {
  miningActive: boolean;
}

/**
 * Animated pulse rings that appear around the button
 */
export const PulseRings = React.memo<PulseRingsProps>(({ miningActive }) => {
  if (miningActive) {
    return (
      <>
        <div className="absolute inset-0 rounded-full bg-darkPurple-500/30 animate-pulse-slow transition-all duration-700"></div>
        <div className="absolute -inset-2 rounded-full bg-indigo-500/20 animate-pulse-slow transition-all duration-700" 
          style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -inset-4 rounded-full bg-navy-500/15 animate-pulse-slow transition-all duration-700" 
          style={{animationDelay: '1s'}}></div>
        <div className="absolute -inset-6 rounded-full bg-darkPurple-400/10 animate-pulse-slow transition-all duration-700" 
          style={{animationDelay: '1.5s'}}></div>
      </>
    );
  }
  
  return (
    <>
      <div className="absolute inset-0 rounded-full bg-darkPurple-900/40 animate-pulse-slow transition-all duration-700"
        style={{animationDuration: '4s'}}></div>
      <div className="absolute -inset-2 rounded-full bg-navy-900/30 animate-pulse-slow transition-all duration-700" 
        style={{animationDuration: '5s'}}></div>
        
      {/* New double rotating rings for inactive state */}
      <div className="absolute -inset-4 rounded-full border border-indigo-700/20 animate-double-spin transition-all duration-700"></div>
      <div className="absolute -inset-6 rounded-full border border-purple-700/15 animate-double-reverse-spin transition-all duration-700"></div>
      <div className="absolute -inset-8 rounded-full border border-navy-700/10 animate-double-spin transition-all duration-700" 
        style={{animationDuration: '15s'}}></div>
    </>
  );
});

PulseRings.displayName = "PulseRings";
