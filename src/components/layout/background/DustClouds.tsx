
import React from "react";

export const DustClouds = () => {
  return (
    <div className="absolute inset-0">
      {/* Distant cosmic dust clouds */}
      <div 
        className="absolute rounded-full bg-indigo-900/5 blur-3xl"
        style={{width: '60%', height: '40%', top: '30%', left: '-10%'}}
      ></div>
      
      <div 
        className="absolute rounded-full bg-purple-900/5 blur-3xl"
        style={{width: '50%', height: '50%', bottom: '-10%', right: '5%'}}
      ></div>
      
      <div 
        className="absolute rounded-full bg-indigo-950/5 blur-3xl animate-pulse-slow"
        style={{
          width: '30%', 
          height: '30%', 
          top: '10%', 
          right: '10%',
          animationDuration: '15s'
        }}
      ></div>
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-noise-pattern opacity-10"></div>
    </div>
  );
};
