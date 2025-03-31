
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
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
    }, 700); // Increased duration for smoother transition
    
    // Add custom properties for our new color theme
    if (theme === "dark") {
      document.documentElement.style.setProperty('--primary', '173 80% 40%'); // teal-600
      document.documentElement.style.setProperty('--secondary', '220 83% 16%'); // navy-900
      document.documentElement.style.setProperty('--accent', '210 100% 20%'); // dark blue
    } else {
      document.documentElement.style.setProperty('--primary', '173 80% 45%'); // teal-500
      document.documentElement.style.setProperty('--secondary', '217 33% 17%'); // navy-800
      document.documentElement.style.setProperty('--accent', '210 100% 30%'); // blue
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
