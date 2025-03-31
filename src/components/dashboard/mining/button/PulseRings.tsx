
import React from "react";

interface PulseRingsProps {
  miningActive: boolean;
}

/**
 * Animated pulse rings that appear around the button
 */
export const PulseRings: React.FC<PulseRingsProps> = ({ miningActive }) => {
  if (miningActive) {
    return (
      <>
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulse-slow"></div>
        <div className="absolute -inset-2 rounded-full bg-indigo-500/10 animate-pulse-slow" 
          style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -inset-4 rounded-full bg-indigo-500/5 animate-pulse-slow" 
          style={{animationDelay: '1s'}}></div>
      </>
    );
  }
  
  return (
    <>
      <div className="absolute inset-0 rounded-full bg-navy-900/40 animate-pulse-slow"
        style={{animationDuration: '4s'}}></div>
      <div className="absolute -inset-2 rounded-full bg-darkPurple-900/30 animate-pulse-slow" 
        style={{animationDuration: '5s'}}></div>
    </>
  );
};
