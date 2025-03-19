
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MenuIcon, 
  Bell, 
  Coins, 
  Sun, 
  Moon, 
  Globe,
  User,
  History,
  UserPlus,
  Award,
  Zap,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-gray-900/80 backdrop-blur-md p-4 flex justify-between items-center shadow-md sticky top-0 z-10 border-b border-gray-800 dark:border-gray-800">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <MenuIcon className="h-6 w-6 text-indigo-300" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-850 border-r border-gray-800">
          <SheetHeader className="border-b border-gray-800 pb-4">
            <SheetTitle className="flex items-center text-indigo-200">
              <Coins className="h-6 w-6 mr-2 text-indigo-400" />
              <Link to="/" className="text-2xl font-bold">{t('app.title')}</Link>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <div className="flex flex-col gap-2">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <Coins className="mr-2 h-5 w-5" />
                  {t('mining.title')}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <User className="mr-2 h-5 w-5" />
                  {t('profile.title')}
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <History className="mr-2 h-5 w-5" />
                  {t('history.title')}
                </Button>
              </Link>
              <Link to="/referral">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t('referral.title')}
                </Button>
              </Link>
              <Link to="/tasks">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <Award className="mr-2 h-5 w-5" />
                  {t('tasks.title')}
                </Button>
              </Link>
              <Link to="/mining/upgrades">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <Zap className="mr-2 h-5 w-5" />
                  {t('mining.upgrades')}
                </Button>
              </Link>
              <Link to="/statistics">
                <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  {t('stats.title')}
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <Coins className="h-6 w-6 mr-2 text-indigo-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t('app.title')}
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Globe className="h-6 w-6 text-indigo-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
            <DropdownMenuItem 
              onClick={() => setLanguage("en")}
              className={`cursor-pointer ${language === "en" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              English {language === "en" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("tr")}
              className={`cursor-pointer ${language === "tr" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              Türkçe {language === "tr" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("zh")}
              className={`cursor-pointer ${language === "zh" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              中文 {language === "zh" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("es")}
              className={`cursor-pointer ${language === "es" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              Español {language === "es" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("ru")}
              className={`cursor-pointer ${language === "ru" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              Русский {language === "ru" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              onClick={() => setLanguage("fr")}
              className={`cursor-pointer ${language === "fr" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              Français {language === "fr" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("de")}
              className={`cursor-pointer ${language === "de" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              Deutsch {language === "de" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("ar")}
              className={`cursor-pointer ${language === "ar" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              العربية {language === "ar" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("pt")}
              className={`cursor-pointer ${language === "pt" ? "bg-indigo-900/50 text-indigo-200" : ""}`}
            >
              Português {language === "pt" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon" 
          className="p-2 rounded-full hover:bg-gray-800 transition-colors" 
          onClick={toggleTheme}
        >
          {theme === "dark" ? 
            <Sun className="h-6 w-6 text-indigo-300" /> : 
            <Moon className="h-6 w-6 text-indigo-300" />
          }
        </Button>

        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
              <Bell className="h-6 w-6 text-indigo-300" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">{t('mining.successful')}</span>
                <span className="text-xs text-gray-400">{t('mining.successfulDesc', "0.1")}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">{t('mining.started')}</span>
                <span className="text-xs text-gray-400">{t('mining.startedDesc')}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
