
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Users, Award, ArrowUpRight, Shield } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MobileNavigation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <nav className="bg-gradient-to-t from-darkPurple-950/95 to-darkPurple-900/95 backdrop-blur-xl border-t border-purple-700/20 fixed bottom-0 left-0 right-0 flex justify-around py-3 px-2 z-50 shadow-[0_-8px_32px_rgba(30,0,60,0.3)] pb-safe">
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

// Extracted NavItem component with enhanced styling
const NavItem = ({ to, icon: Icon, label, isActive }: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
}) => {
  return (
    <Link to={to} className="flex flex-col items-center transition-all duration-300 relative group">
      <div className="relative">
        {/* Base container */}
        <div className={`p-2 rounded-full transition-all duration-300 ${isActive 
          ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg' 
          : 'text-purple-400 hover:text-purple-300 group-hover:bg-darkPurple-800/60'}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        {/* Glow effect for active state */}
        {isActive && (
          <div className="absolute inset-0 -z-10 bg-purple-500/20 rounded-full blur-md"></div>
        )}
      </div>
      
      <span className={`text-xs mt-1 transition-all duration-300 ${
        isActive 
          ? 'font-medium text-purple-300' 
          : 'text-purple-400/60 group-hover:text-purple-400'
      }`}>
        {label}
      </span>
    </Link>
  );
};

export default MobileNavigation;
