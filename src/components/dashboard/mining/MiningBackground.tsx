
import React from "react";

/**
 * Component that renders the decorative background for the mining card
 */
export const MiningBackground: React.FC = () => {
  return (
    <>
      {/* Main background with warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-amber-900 to-red-900"></div>
      
      {/* Honeycomb pattern overlay */}
      <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik0yOCAwTDAgNTBsMjggNTBsMjgtNTBMMjggMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>
      
      {/* Radial glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 rounded-full bg-red-500/10 blur-3xl"></div>
      </div>
      
      {/* Ember particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-amber-300/40 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Heat effect overlay */}
      <div className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `repeating-radial-gradient(circle at 20% 50%, rgba(255,69,0,0.1), rgba(255,165,0,0.1) 10px, transparent 10px, transparent 20px)`
        }}>
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-t from-orange-950/40 to-transparent"></div>
    </>
  );
};
