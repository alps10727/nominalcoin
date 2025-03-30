
import { useState } from "react";
import { MenuIcon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainNavigation } from "./MainNavigation";

export const MobileMenu = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  // Fixed menu button functionality by separating it completely from Sheet component
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        type="button"
      >
        <MenuIcon className="h-6 w-6 text-indigo-300" />
        <span className="sr-only">Menüyü Aç</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-gray-850 border-r border-gray-800 z-50">
          <SheetHeader className="border-b border-gray-800 pb-4">
            <SheetTitle className="flex items-center text-indigo-200">
              <Coins className="h-6 w-6 mr-2 text-indigo-400" />
              <Link to="/" className="text-2xl font-bold" onClick={() => setOpen(false)}>{t('app.title')}</Link>
            </SheetTitle>
          </SheetHeader>
          <MainNavigation onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};
