
import React from "react";

export const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 250 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-star-twinkle"
          style={{
            width: Math.random() < 0.85 ? '1px' : Math.random() < 0.97 ? '2px' : '3px',
            height: Math.random() < 0.85 ? '1px' : Math.random() < 0.97 ? '2px' : '3px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3, 
            animationDuration: `${Math.random() * 5 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};
