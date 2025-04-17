
import React from "react";

export const StarField = () => {
  return (
    <div className="absolute inset-0">
      {/* Small stars */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={`star-sm-${i}`}
          className="absolute rounded-full bg-white opacity-60 animate-pulse-slow"
          style={{
            width: '1px',
            height: '1px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      {/* Medium stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`star-md-${i}`}
          className="absolute rounded-full bg-white opacity-70 animate-pulse-slow"
          style={{
            width: '2px',
            height: '2px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${4 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      {/* Large bright stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`star-lg-${i}`}
          className="absolute rounded-full bg-white opacity-90 animate-pulse-slow"
          style={{
            width: '3px',
            height: '3px',
            boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.4)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 7}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};
