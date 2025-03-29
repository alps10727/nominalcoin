
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Users, ArrowUpRight, Shield, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  return (
    <nav className="bg-gray-900/80 backdrop-blur-xl border-t border-violet-900/30 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <Link to="/" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'bg-violet-900/60 text-violet-300 shadow-lg shadow-violet-900/30' : 'hover:bg-gray-800/60'}`}>
          <Zap className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/' ? 'font-medium text-violet-300' : ''}`}>{t('nav.mining')}</span>
      </Link>
      <Link to="/referral" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/referral' ? 'bg-violet-900/60 text-violet-300 shadow-lg shadow-violet-900/30' : 'hover:bg-gray-800/60'}`}>
          <Users className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/referral' ? 'font-medium text-violet-300' : ''}`}>{t('nav.team')}</span>
      </Link>
      <Link to="/tasks" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/tasks' ? 'bg-violet-900/60 text-violet-300 shadow-lg shadow-violet-900/30' : 'hover:bg-gray-800/60'}`}>
          <Award className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/tasks' ? 'font-medium text-violet-300' : ''}`}>{t('nav.tasks')}</span>
      </Link>
      <Link to="/history" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/history' ? 'bg-violet-900/60 text-violet-300 shadow-lg shadow-violet-900/30' : 'hover:bg-gray-800/60'}`}>
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/history' ? 'font-medium text-violet-300' : ''}`}>{t('nav.transfer')}</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/profile' ? 'bg-violet-900/60 text-violet-300 shadow-lg shadow-violet-900/30' : 'hover:bg-gray-800/60'}`}>
          <Shield className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/profile' ? 'font-medium text-violet-300' : ''}`}>{t('nav.security')}</span>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
