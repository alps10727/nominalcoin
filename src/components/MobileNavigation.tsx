
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Users, ArrowUpRight, Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-1px_5px_rgba(0,0,0,0.3)]">
      <Link to="/" className="flex flex-col items-center text-gray-500">
        <div className={`p-1.5 rounded-full ${location.pathname === '/' ? 'bg-indigo-900/50 text-indigo-400' : ''}`}>
          <Zap className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 ${location.pathname === '/' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.mining')}</span>
      </Link>
      <Link to="/referral" className="flex flex-col items-center text-gray-500">
        <div className={`p-1.5 rounded-full ${location.pathname === '/referral' ? 'bg-indigo-900/50 text-indigo-400' : ''}`}>
          <Users className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 ${location.pathname === '/referral' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.team')}</span>
      </Link>
      <Link to="/history" className="flex flex-col items-center text-gray-500">
        <div className={`p-1.5 rounded-full ${location.pathname === '/history' ? 'bg-indigo-900/50 text-indigo-400' : ''}`}>
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 ${location.pathname === '/history' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.transfer')}</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-500">
        <div className={`p-1.5 rounded-full ${location.pathname === '/profile' ? 'bg-indigo-900/50 text-indigo-400' : ''}`}>
          <Shield className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 ${location.pathname === '/profile' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.security')}</span>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
