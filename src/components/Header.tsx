
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { Bell, WifiOff, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, memo } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = memo(() => {
  const { currentUser } = useAuth();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor internet connection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Page refresh function
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-b from-darkPurple-950/95 to-darkPurple-900/95 backdrop-blur-xl pt-safe p-4 flex justify-between items-center sticky top-0 z-50 border-b border-purple-700/20 shadow-md">
      {/* Offline warning */}
      {isOffline && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-800/90 text-white text-xs py-1 text-center flex items-center justify-center">
          <WifiOff className="h-3 w-3 mr-1" />
          Çevrimdışı mod
          <Button 
            variant="link" 
            size="sm" 
            className="text-white text-xs ml-2 p-0 h-auto"
            onClick={refreshPage}
          >
            Yenile
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2 relative z-10">
        <MobileMenu />
        <Logo />
        <span className="text-lg font-bold fc-gradient-text">Future Coin</span>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {/* Special offers button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="bg-darkPurple-800/30 border border-purple-700/30 text-purple-300 hover:bg-darkPurple-800/60 hidden md:flex"
        >
          <Gift className="h-4 w-4 mr-1.5" />
          <span>Offers</span>
        </Button>
        
        <LanguageSwitcher />
        <ThemeToggle />
        
        <Link to="/notifications" className="relative p-1.5 rounded-full hover:bg-purple-800/50 transition-colors">
          <Bell className="h-5 w-5 text-purple-300" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-darkPurple-900"></span>
        </Link>
      </div>
    </header>
  );
});

// DisplayName for easier debugging
Header.displayName = "Header";

export default Header;
