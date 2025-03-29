
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
      {/* Cosmos-inspired background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-darkPurple-800/90 to-navy-800/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Animated stars/particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/80 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-darkPurple-500/20 to-navy-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon container with rotation animation */}
      <div className={`relative z-10 transition-transform duration-500 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100'}`}>
        {theme === "dark" ? 
          <Sun className="h-5 w-5 text-yellow-300 transition-all duration-300 group-hover:scale-110" /> : 
          <Moon className="h-5 w-5 text-darkPurple-300 transition-all duration-300 group-hover:scale-110" />
        }
      </div>
      
      {/* Orbit ring */}
      <div className="absolute inset-0 rounded-full border border-darkPurple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Button>
  );
};
