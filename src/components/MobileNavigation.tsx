
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
    <nav className="bg-gray-900/80 backdrop-blur-md border-t border-indigo-900/30 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <Link to="/" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'bg-indigo-900/50 text-indigo-400 shadow-lg shadow-indigo-900/20' : 'hover:bg-gray-800/50'}`}>
          <Zap className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.mining')}</span>
      </Link>
      <Link to="/referral" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/referral' ? 'bg-indigo-900/50 text-indigo-400 shadow-lg shadow-indigo-900/20' : 'hover:bg-gray-800/50'}`}>
          <Users className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/referral' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.team')}</span>
      </Link>
      <Link to="/tasks" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/tasks' ? 'bg-indigo-900/50 text-indigo-400 shadow-lg shadow-indigo-900/20' : 'hover:bg-gray-800/50'}`}>
          <Award className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/tasks' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.tasks')}</span>
      </Link>
      <Link to="/history" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/history' ? 'bg-indigo-900/50 text-indigo-400 shadow-lg shadow-indigo-900/20' : 'hover:bg-gray-800/50'}`}>
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/history' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.transfer')}</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-500 transition-all duration-300">
        <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/profile' ? 'bg-indigo-900/50 text-indigo-400 shadow-lg shadow-indigo-900/20' : 'hover:bg-gray-800/50'}`}>
          <Shield className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/profile' ? 'font-medium text-indigo-400' : ''}`}>{t('nav.security')}</span>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
