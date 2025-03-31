
import React from "react";

/**
 * Component that renders the cosmic-themed background for the mining card
 */
export const MiningBackground: React.FC = () => {
  return (
    <>
      {/* Deep space background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-950"></div>
      
      {/* Subtle galaxy pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), 
                          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Cosmic dust */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDIwMHYyMDBIMHoiLz48L3N2Zz4=')] opacity-10"></div>
      
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
              animationDuration: `${Math.random() * 5 + 1}s`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Energy nebula */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
      </div>
      
      {/* Larger stars with glow */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 3 + 2}px ${Math.random() * 2 + 1}px rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Glass overlay for better text contrast */}
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>
    </>
  );
};
