
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize theme state safely
  const [theme, setTheme] = useState<Theme>(() => {
    // Default to dark mode if we can't determine
    if (typeof window === "undefined") return "dark";
    
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("futureCoinTheme") as Theme | null;
    
    // Check system preference if no stored theme
    if (!storedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    
    return storedTheme || "dark";
  });

  useEffect(() => {
    // Apply theme to document element with improved transitions
    document.documentElement.classList.toggle("dark", theme === "dark");
    
    // Store theme preference
    localStorage.setItem("futureCoinTheme", theme);
    
    // Apply transition class for smoother theme switching
    document.documentElement.classList.add('theme-transition');
    
    // Remove transition class after animation completes to prevent transition
    // effects when other properties change
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 700);
    
    // Add custom properties for our new balanced color theme
    if (theme === "dark") {
      document.documentElement.style.setProperty('--primary', '262 83% 58%'); // vibrant purple
      document.documentElement.style.setProperty('--secondary', '262 64% 27%'); // muted purple
      document.documentElement.style.setProperty('--accent', '262 95% 39%'); // deep purple
      
      // Ensure text is visible in dark mode
      document.documentElement.style.setProperty('--text-primary', '0 0% 95%'); // almost white
      document.documentElement.style.setProperty('--text-secondary', '250 95% 85%'); // light purple
    } else {
      document.documentElement.style.setProperty('--primary', '262 83% 68%'); // lighter purple
      document.documentElement.style.setProperty('--secondary', '262 60% 30%'); // medium purple
      document.documentElement.style.setProperty('--accent', '262 95% 45%'); // bright purple
      
      // Ensure text is visible in light mode
      document.documentElement.style.setProperty('--text-primary', '0 0% 10%'); // almost black
      document.documentElement.style.setProperty('--text-secondary', '250 50% 30%'); // dark purple
    }
    
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  }, []);

  const isDarkMode = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
