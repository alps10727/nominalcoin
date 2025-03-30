
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { NotificationsDropdown } from "./header/NotificationsDropdown";
import { Stars, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useAuth();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  // İnternet bağlantısını izle
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
  
  // Sayfa yenileme işlevi
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-r from-darkPurple-900/95 via-navy-900/90 to-darkPurple-900/95 backdrop-blur-xl pt-safe p-4 flex justify-between items-center shadow-lg sticky top-0 z-10 border-b border-violet-500/20">
      {/* Dekoratif arka plan deseni */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-70"></div>
      
      {/* Header parlama efekti */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkPurple-400/10 to-transparent"></div>
      
      {/* Çevrimdışı uyarısı */}
      {isOffline && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-800/80 text-white text-xs py-1 text-center flex items-center justify-center">
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
      
      <div className="flex items-center">
        <MobileMenu />
        <Logo />
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        {currentUser && <NotificationsDropdown />}
      </div>
    </header>
  );
};

export default Header;
