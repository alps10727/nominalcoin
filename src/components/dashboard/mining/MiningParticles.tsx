
import React from "react";

interface MiningParticlesProps {
  miningActive: boolean;
}

export const MiningParticles: React.FC<MiningParticlesProps> = ({ miningActive }) => {
  if (!miningActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Energy field */}
      <div className="absolute w-full h-full rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-purple-500/10"></div>
      
      {/* Basic data visualization elements */}
      <div className="absolute w-full h-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-px w-40 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
            style={{
              top: `${30 + i * 20}%`,
              left: '10%',
            }}
          />
        ))}
      </div>
    </div>
  );
};
