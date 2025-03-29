
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="p-2 rounded-full hover:bg-darkPurple-800 transition-colors" 
      onClick={toggleTheme}
    >
      {theme === "dark" ? 
        <Sun className="h-6 w-6 text-darkPurple-300" /> : 
        <Moon className="h-6 w-6 text-darkPurple-300" />
      }
    </Button>
  );
};
