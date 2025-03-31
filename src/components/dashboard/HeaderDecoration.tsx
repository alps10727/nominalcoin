
import React from 'react';
import { Stars, Zap, Coins } from 'lucide-react';

const HeaderDecoration = () => {
  return (
    <div className="w-full relative mb-3 overflow-hidden">
      {/* Dekoratif arka plan çizgisi */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
      
      {/* Animasyonlu semboller */}
      <div className="flex justify-around py-2 overflow-hidden">
        <div className="flex -space-x-1 opacity-60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`star-${i}`}
              className="w-px h-px bg-purple-400 rounded-full p-0.5"
              style={{
                animation: `float-data ${2 + i * 0.5}s ease-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        <Stars className="h-3 w-3 text-purple-300/30 animate-pulse-slow" />
        
        <div className="px-2 py-1 text-xs font-medium text-indigo-200/80 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-full backdrop-blur-sm">
          <div className="flex items-center">
            <Coins className="h-3 w-3 mr-1 text-indigo-300/70" />
            <span className="text-[10px]">Kripto madenciliği</span>
          </div>
        </div>
        
        <Zap className="h-3 w-3 text-amber-300/30 animate-pulse-slow" />
        
        <div className="flex -space-x-1 opacity-60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`dot-${i}`}
              className="w-px h-px bg-indigo-400 rounded-full p-0.5"
              style={{
                animation: `float-data ${2 + i * 0.5}s ease-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Dekoratif alt çizgi */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
    </div>
  );
};

export default HeaderDecoration;
