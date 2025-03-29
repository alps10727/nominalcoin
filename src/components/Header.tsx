
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { NotificationsDropdown } from "./header/NotificationsDropdown";
import { Stars } from "lucide-react";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-gradient-to-r from-darkPurple-900/95 via-navy-900/90 to-darkPurple-900/95 backdrop-blur-xl p-4 flex justify-between items-center shadow-lg sticky top-0 z-10 border-b border-violet-500/20">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/50 rounded-full animate-star-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: Math.random() * 0.5
            }}
          />
        ))}
      </div>
      
      <MobileMenu />

      <div className="flex items-center">
        <div className="mr-1 text-darkPurple-300 hidden sm:block">
          <Stars className="h-4 w-4 animate-cosmic-pulse" />
        </div>
        <Logo />
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationsDropdown />
      </div>
    </header>
  );
};

export default Header;
