
import { Sun, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 700);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative w-10 h-10 rounded-full transition-all duration-500 overflow-hidden group"
      onClick={handleToggle}
    >
      {/* Enhanced background effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-darkPurple-800/80 to-navy-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Border highlight with animated glow */}
      <div className="absolute inset-0 rounded-full border border-darkPurple-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated cosmic particles */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-purple-300/60 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>
      
      {/* Outer rotating ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-dashed border-darkPurple-400/30 ${isAnimating ? 'animate-spin-slow' : ''} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Inner counter-rotating ring */}
      <div className={`absolute inset-[3px] rounded-full border border-dotted border-darkPurple-300/40 ${isAnimating ? 'animate-reverse-spin' : ''} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Icon container with enhanced animation */}
      <div className={`relative z-10 transition-transform duration-700 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100'}`}>
        {theme === "dark" ? (
          <div className="relative">
            <Sun className="h-5 w-5 text-yellow-300 transition-all duration-500 group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-200/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="relative">
            <Moon className="h-5 w-5 text-darkPurple-300 transition-all duration-500 group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-darkPurple-200/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}
      </div>
      
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-darkPurple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
    </Button>
  );
};
