
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Users, ArrowUpRight, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNavigation = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-1px_5px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col items-center text-indigo-400">
        <div className="p-1.5 rounded-full bg-indigo-900/50">
          <Zap className="h-5 w-5" />
        </div>
        <span className="text-xs mt-1 font-medium">{t('nav.mining')}</span>
      </div>
      <div className="flex flex-col items-center text-gray-500">
        <div className="p-1.5 rounded-full">
          <Users className="h-5 w-5" />
        </div>
        <span className="text-xs mt-1">{t('nav.team')}</span>
      </div>
      <div className="flex flex-col items-center text-gray-500">
        <div className="p-1.5 rounded-full">
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <span className="text-xs mt-1">{t('nav.transfer')}</span>
      </div>
      <div className="flex flex-col items-center text-gray-500">
        <div className="p-1.5 rounded-full">
          <Shield className="h-5 w-5" />
        </div>
        <span className="text-xs mt-1">{t('nav.security')}</span>
      </div>
    </nav>
  );
};

export default MobileNavigation;
