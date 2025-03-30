
import { useState } from "react";
import { MenuIcon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetOverlay,
  SheetPortal,
  SheetClose,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainNavigation } from "./MainNavigation";

export const MobileMenu = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  const handleOpenMenu = () => {
    console.log("Opening menu, current state:", open);
    setOpen(true);
  };
  
  const handleCloseMenu = () => {
    console.log("Closing menu");
    setOpen(false);
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none"
        onClick={handleOpenMenu}
        aria-label="Open menu"
        type="button"
      >
        <MenuIcon className="h-6 w-6 text-indigo-300" />
        <span className="sr-only">{t('menu.open')}</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-gray-850 border-r border-gray-800 z-50 w-64 fixed inset-y-0">
          <SheetHeader className="border-b border-gray-800 pb-4">
            <SheetTitle className="flex items-center text-indigo-200">
              <Coins className="h-6 w-6 mr-2 text-indigo-400" />
              <Link to="/" className="text-2xl font-bold" onClick={handleCloseMenu}>{t('app.title')}</Link>
            </SheetTitle>
          </SheetHeader>
          <MainNavigation onNavigate={handleCloseMenu} />
          <SheetClose className="hidden" />
        </SheetContent>
      </Sheet>
    </>
  );
};
