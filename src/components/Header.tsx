
import { MobileMenu } from "./header/MobileMenu";
import { Logo } from "./header/Logo";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { ThemeToggle } from "./header/ThemeToggle";
import { NotificationsDropdown } from "./header/NotificationsDropdown";
import { Stars } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-gradient-to-r from-darkPurple-900/95 via-navy-900/90 to-darkPurple-900/95 backdrop-blur-xl pt-safe p-4 flex justify-between items-center shadow-lg sticky top-0 z-10 border-b border-violet-500/20">
      {/* Dekoratif arka plan deseni */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-70"></div>
      
      {/* Header parlama efekti */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkPurple-400/10 to-transparent"></div>
      
      <MobileMenu />

      <div className="flex items-center">
        <div className="mr-1 text-darkPurple-300 hidden sm:block">
          <Stars className="h-4 w-4 animate-pulse-slow" />
        </div>
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
