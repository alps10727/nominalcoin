
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  User,
  History,
  UserPlus,
  Award,
  Zap,
  BarChart
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { memo } from "react";

interface MainNavigationProps {
  onNavigate?: () => void;
}

// Memoized navigation items to prevent unnecessary re-renders
const NavigationItem = memo(({ 
  to, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  onClick?: () => void;
}) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-gray-200 hover:bg-cyan-800/20 hover:text-white transition-colors"
        tabIndex={0}
      >
        <Icon className="mr-2 h-5 w-5 text-cyan-400" />
        {label}
      </Button>
    </Link>
  );
});

NavigationItem.displayName = "NavigationItem";

// Optimized MainNavigation component using memoization for better performance
export const MainNavigation = memo(({ onNavigate }: MainNavigationProps) => {
  const { t } = useLanguage();
  
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };
  
  // Navigation items configuration for easy maintenance - add back statistics item
  const navigationItems = [
    { to: "/", icon: Coins, label: t('mining.title') },
    { to: "/profile", icon: User, label: t('profile.title') },
    { to: "/history", icon: History, label: t('history.title') },
    { to: "/referral", icon: UserPlus, label: t('referral.title') },
    { to: "/tasks", icon: Award, label: t('tasks.title') },
    { to: "/mining/upgrades", icon: Zap, label: t('mining.upgrades') },
    { to: "/statistics", icon: BarChart, label: t('statistics.title') },
  ];
  
  return (
    <div className="py-4 bg-gradient-to-b from-cyan-900/10 to-indigo-900/10 rounded-xl border border-cyan-500/20 shadow-lg mb-4">
      <div className="flex flex-col gap-1.5 px-2">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
});

MainNavigation.displayName = "MainNavigation";
