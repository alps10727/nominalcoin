
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
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-800/80 to-emerald-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Border highlight */}
      <div className="absolute inset-0 rounded-full border border-teal-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon container with enhanced animation */}
      <div className={`relative z-10 transition-transform duration-700 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100'}`}>
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-300 transition-all duration-500 group-hover:scale-110" />
        ) : (
          <Moon className="h-5 w-5 text-teal-300 transition-all duration-500 group-hover:scale-110" />
        )}
      </div>
    </Button>
  );
};
