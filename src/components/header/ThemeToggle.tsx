
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 600);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative w-10 h-10 rounded-full transition-all duration-300 overflow-hidden group"
      onClick={handleToggle}
    >
      {/* Enhanced background effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-darkPurple-800/90 to-navy-800/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Border highlight */}
      <div className="absolute inset-0 rounded-full border border-darkPurple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Outer rotating ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-dashed border-darkPurple-400/30 ${isAnimating ? 'animate-spin-slow' : ''} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Inner counter-rotating ring */}
      <div className={`absolute inset-[3px] rounded-full border border-dotted border-darkPurple-300/40 ${isAnimating ? 'animate-reverse-spin' : ''} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Icon container with rotation animation */}
      <div className={`relative z-10 transition-transform duration-500 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100'}`}>
        {theme === "dark" ? 
          <Sun className="h-5 w-5 text-yellow-300 transition-all duration-300 group-hover:scale-110" /> : 
          <Moon className="h-5 w-5 text-darkPurple-300 transition-all duration-300 group-hover:scale-110" />
        }
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-darkPurple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Button>
  );
};
