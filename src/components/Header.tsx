
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
    <header className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl pt-safe p-4 flex justify-between items-center shadow-lg sticky top-0 z-50 border-b border-gray-700/30">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-30"></div>
      
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
