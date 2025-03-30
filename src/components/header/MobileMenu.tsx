
import { useState } from "react";
import { MenuIcon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetPortal,
  SheetOverlay,
  SheetClose,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MainNavigation } from "./MainNavigation";

export const MobileMenu = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  const handleOpenMenu = () => {
    console.log("Opening mobile menu, current state:", open);
    setOpen(true);
  };
  
  const handleCloseMenu = () => {
    console.log("Closing mobile menu");
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
        <SheetPortal>
          <SheetOverlay className="bg-black/60" />
          <SheetContent side="left" className="w-[280px] max-w-[85vw] bg-gray-850 border-r border-gray-800 p-0">
            <SheetHeader className="border-b border-gray-800 pb-4 px-4 pt-4">
              <SheetTitle className="flex items-center text-indigo-200">
                <Coins className="h-6 w-6 mr-2 text-indigo-400" />
                <Link to="/" className="text-2xl font-bold" onClick={handleCloseMenu}>{t('app.title')}</Link>
              </SheetTitle>
            </SheetHeader>
            <div className="px-2 py-4">
              <MainNavigation onNavigate={handleCloseMenu} />
            </div>
            <SheetClose className="hidden" />
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </>
  );
};
