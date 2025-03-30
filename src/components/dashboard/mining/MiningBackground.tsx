
import React from "react";

/**
 * Component that renders the decorative background for the mining card
 */
export const MiningBackground: React.FC = () => {
  return (
    <>
      {/* Main background with futuristic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900"></div>
      
      {/* Hexagon pattern overlay */}
      <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDg0IDQ4Ij48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIgZD0iTTAuNywwLDkuMyw4LjYsMTgsOCw5LjMsLTAuNlpNMTgsMTYuOSwyNi42LDI1LjUsMzUuMiwyNC45LDI2LjYsMTYuM1pNMzUuMiwzMy44LDQzLjgsNDIuNSw1Mi40LDQxLjksNDMuOCwzMy4yWk01Mi40LDguNiw2MSw2Miw2OS42LDE3LjUsNjEsOVpNNjkuNiwyNS41LDc4LjIsMzQuMSw4Ni44LDMzLjUsNzguMiwyNC45WiI+PC9wYXRoPjwvc3ZnPg==')]"></div>
      
      {/* Radial glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>
      
      {/* Circuit board lines */}
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(0,212,255,0.15) 0px, rgba(0,212,255,0.15) 1px, transparent 1px, transparent 30px), 
                            repeating-linear-gradient(180deg, rgba(0,212,255,0.15) 0px, rgba(0,212,255,0.15) 1px, transparent 1px, transparent 30px)`
        }}>
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-t from-blue-950/40 to-transparent"></div>
    </>
  );
};
