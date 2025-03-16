
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MenuIcon, 
  Bell, 
  Coins, 
  Sun, 
  Moon, 
  Globe
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
              <span className="text-2xl font-bold">{t('app.title')}</span>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                <Coins className="mr-2 h-5 w-5" />
                {t('mining.title')}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                <Bell className="mr-2 h-5 w-5" />
                {t('security.title')}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
                <MenuIcon className="mr-2 h-5 w-5" />
                {t('transfer.title')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center">
        <Coins className="h-6 w-6 mr-2 text-indigo-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {t('app.title')}
        </h1>
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
