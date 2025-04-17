
import React from "react";

export const BaseGradient = () => {
  return (
    <div className="absolute inset-0">
      {/* Deep space background with rich gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10101e] via-[#1A1F2C] to-[#10101e]"></div>
      
      {/* Subtle darker regions */}
      <div className="absolute inset-0 bg-black opacity-30 bg-noise-pattern"></div>
      
      {/* Slight color variations for depth */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-purple-950/20 to-transparent blur-3xl"
        style={{width: '70%', height: '60%', top: '10%', left: '15%'}}
      ></div>
    </div>
  );
};
