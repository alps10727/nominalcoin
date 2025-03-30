
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Users, ArrowUpRight, Shield, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MobileNavigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-darkPurple-950/95 via-navy-950/90 to-darkPurple-950/95 backdrop-blur-xl border-t border-purple-900/20 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-safe">
      <Link to="/" className="flex flex-col items-center transition-all duration-300">
        <div className={`p-2 rounded-lg transition-all duration-300 ${location.pathname === '/' 
          ? 'bg-gradient-to-br from-purple-800/80 to-indigo-900/80 text-white shadow-lg shadow-purple-900/30' 
          : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-300'}`}>
          <Zap className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/' ? 'font-medium text-white' : 'text-gray-500'}`}>{t('nav.mining')}</span>
      </Link>
      
      <Link to="/referral" className="flex flex-col items-center transition-all duration-300">
        <div className={`p-2 rounded-lg transition-all duration-300 ${location.pathname === '/referral' 
          ? 'bg-gradient-to-br from-purple-800/80 to-indigo-900/80 text-white shadow-lg shadow-purple-900/30' 
          : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-300'}`}>
          <Users className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/referral' ? 'font-medium text-white' : 'text-gray-500'}`}>{t('nav.team')}</span>
      </Link>
      
      <Link to="/tasks" className="flex flex-col items-center transition-all duration-300">
        <div className={`p-2 rounded-lg transition-all duration-300 ${location.pathname === '/tasks' 
          ? 'bg-gradient-to-br from-purple-800/80 to-indigo-900/80 text-white shadow-lg shadow-purple-900/30' 
          : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-300'}`}>
          <Award className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/tasks' ? 'font-medium text-white' : 'text-gray-500'}`}>{t('nav.tasks')}</span>
      </Link>
      
      <Link to="/history" className="flex flex-col items-center transition-all duration-300">
        <div className={`p-2 rounded-lg transition-all duration-300 ${location.pathname === '/history' 
          ? 'bg-gradient-to-br from-purple-800/80 to-indigo-900/80 text-white shadow-lg shadow-purple-900/30' 
          : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-300'}`}>
          <ArrowUpRight className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${location.pathname === '/history' ? 'font-medium text-white' : 'text-gray-500'}`}>{t('nav.transfer')}</span>
      </Link>
      
      <Link to={currentUser ? "/profile" : "/sign-in"} className="flex flex-col items-center transition-all duration-300">
        <div className={`p-2 rounded-lg transition-all duration-300 ${(location.pathname === '/profile' || location.pathname === '/sign-in') 
          ? 'bg-gradient-to-br from-purple-800/80 to-indigo-900/80 text-white shadow-lg shadow-purple-900/30' 
          : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-300'}`}>
          <Shield className="h-5 w-5" />
        </div>
        <span className={`text-xs mt-1 transition-all duration-300 ${(location.pathname === '/profile' || location.pathname === '/sign-in') ? 'font-medium text-white' : 'text-gray-500'}`}>{t('nav.security')}</span>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
