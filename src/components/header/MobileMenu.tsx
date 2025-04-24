
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
import MainNavigation from "./MainNavigation";  // Fixed import

export const MobileMenu = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  const handleOpenMenu = () => {
    setOpen(true);
  };
  
  const handleCloseMenu = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 rounded-full hover:bg-navy-800 transition-colors focus:outline-none"
        onClick={handleOpenMenu}
        aria-label="Open menu"
        type="button"
      >
        <MenuIcon className="h-6 w-6 text-cyan-300" />
        <span className="sr-only">{t('menu.open')}</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetPortal>
          <SheetOverlay className="bg-black/70 backdrop-blur-sm" onClick={handleCloseMenu} />
          <SheetContent side="left" className="w-[280px] max-w-[85vw] bg-gradient-to-b from-navy-950 to-darkPurple-950 border-r border-cyan-500/20 p-0">
            <SheetHeader className="border-b border-cyan-500/20 pb-4 px-4 pt-4">
              <SheetTitle className="flex items-center text-cyan-200">
                <div className="p-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 mr-2">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <Link to="/" className="text-2xl font-bold uppercase bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent" onClick={handleCloseMenu}>{t('app.title')}</Link>
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
