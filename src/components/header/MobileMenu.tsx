
import { useState } from "react";
import { MenuIcon, Zap } from "lucide-react";
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
        className="p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none"
        onClick={handleOpenMenu}
        aria-label="Open menu"
        type="button"
      >
        <MenuIcon className="h-6 w-6 text-teal-300" />
        <span className="sr-only">{t('menu.open')}</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetPortal>
          <SheetOverlay className="bg-black/70 backdrop-blur-sm" onClick={handleCloseMenu} />
          <SheetContent side="left" className="w-[280px] max-w-[85vw] bg-gray-900 border-r border-teal-500/20 p-0">
            <SheetHeader className="border-b border-teal-500/20 pb-4 px-4 pt-4">
              <SheetTitle className="flex items-center text-teal-200">
                <div className="h-7 w-7 mr-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-md flex items-center justify-center shadow-md">
                  <Zap className="h-4 w-4 text-white" />
                </div>
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
