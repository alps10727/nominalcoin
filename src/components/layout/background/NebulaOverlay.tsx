
import React from "react";

export const NebulaOverlay = () => {
  return (
    <div className="absolute inset-0">
      {/* Nebula clouds with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-indigo-800/10 to-purple-900/5 opacity-70"></div>
      
      {/* Nebula effect with animation */}
      <div className="absolute inset-0 fc-nebula"></div>
      
      {/* Colorful nebular regions */}
      <div 
        className="absolute rounded-full bg-gradient-to-r from-purple-600/10 via-indigo-500/5 to-purple-600/10 blur-3xl animate-nebula-shift"
        style={{ 
          width: '60%', 
          height: '40%', 
          top: '10%', 
          left: '20%',
          animationDuration: '120s'
        }}
      ></div>
      
      <div 
        className="absolute rounded-full bg-gradient-to-r from-indigo-600/10 via-purple-500/5 to-indigo-600/10 blur-3xl animate-nebula-shift"
        style={{ 
          width: '50%', 
          height: '60%', 
          bottom: '5%', 
          right: '15%',
          animationDuration: '150s',
          animationDelay: '10s'
        }}
      ></div>
    </div>
  );
};
