
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative p-2 rounded-full hover:bg-darkPurple-800/70 transition-all duration-300 overflow-hidden" 
      onClick={toggleTheme}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-darkPurple-500/20 to-navy-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {theme === "dark" ? 
        <Sun className="h-6 w-6 text-yellow-300 transition-all duration-300 hover:scale-110" /> : 
        <Moon className="h-6 w-6 text-darkPurple-300 transition-all duration-300 hover:scale-110" />
      }
    </Button>
  );
};
