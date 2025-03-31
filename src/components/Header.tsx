
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { NotificationsDropdown } from "./header/NotificationsDropdown";
import { WifiOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, memo } from "react";
import { Button } from "./ui/button";

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
    <header className="bg-navy-950/90 backdrop-blur-lg pt-safe p-4 flex justify-between items-center shadow-lg sticky top-0 z-50 border-b border-teal-500/10">
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
      
      <div className="flex items-center relative z-10">
        <MobileMenu />
        <Logo />
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <LanguageSwitcher />
        <ThemeToggle />
        {currentUser && <NotificationsDropdown />}
      </div>
    </header>
  );
});

// DisplayName for easier debugging
Header.displayName = "Header";

export default Header;
