
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Users, ArrowUpRight, Shield, Award } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MobileNavigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 backdrop-blur-xl border-t border-purple-500/20 fixed bottom-0 left-0 right-0 flex justify-around p-3 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-safe">
      <NavItem 
        to="/" 
        icon={Zap} 
        label={t('nav.mining')} 
        isActive={location.pathname === '/'} 
      />
      
      <NavItem 
        to="/referral" 
        icon={Users} 
        label={t('nav.team')} 
        isActive={location.pathname === '/referral'} 
      />
      
      <NavItem 
        to="/tasks" 
        icon={Award} 
        label={t('nav.tasks')} 
        isActive={location.pathname === '/tasks'} 
      />
      
      <NavItem 
        to="/history" 
        icon={ArrowUpRight} 
        label={t('nav.transfer')} 
        isActive={location.pathname === '/history'} 
      />
      
      <NavItem 
        to={currentUser ? "/profile" : "/sign-in"} 
        icon={Shield} 
        label={t('nav.security')} 
        isActive={location.pathname === '/profile' || location.pathname === '/sign-in'} 
      />
    </nav>
  );
};

// Extracted NavItem component for cleaner code
const NavItem = ({ to, icon: Icon, label, isActive }: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
}) => {
  return (
    <Link to={to} className="flex flex-col items-center transition-all duration-300 relative z-10">
      <div className={`p-2 rounded-xl transition-all duration-300 ${isActive 
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 scale-110' 
        : 'text-gray-400 hover:bg-gray-800/60 hover:text-purple-300'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className={`text-xs mt-1 transition-all duration-300 ${isActive ? 'font-medium text-purple-200' : 'text-gray-400'}`}>
        {label}
      </span>
    </Link>
  );
};

export default MobileNavigation;
