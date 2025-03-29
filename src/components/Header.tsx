
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { NotificationsDropdown } from "./header/NotificationsDropdown";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-gradient-to-r from-gray-950/95 via-indigo-950/90 to-purple-950/95 backdrop-blur-xl p-4 flex justify-between items-center shadow-lg sticky top-0 z-10 border-b border-violet-500/20">
      <MobileMenu />

      <div className="flex items-center">
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
