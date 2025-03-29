
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { NotificationsDropdown } from "./header/NotificationsDropdown";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-gray-900/60 backdrop-blur-xl p-4 flex justify-between items-center shadow-lg sticky top-0 z-10 border-b border-indigo-900/20 dark:border-indigo-900/20">
      <MobileMenu />

      <div className="flex items-center">
        <Logo />
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationsDropdown />
      </div>
    </header>
  );
};

export default Header;
