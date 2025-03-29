
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  User,
  History,
  UserPlus,
  Award,
  Zap,
  BarChart2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const MainNavigation = () => {
  const { t } = useLanguage();
  
  return (
    <div className="py-4">
      <div className="flex flex-col gap-2">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <Coins className="mr-2 h-5 w-5" />
            {t('mining.title')}
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <User className="mr-2 h-5 w-5" />
            {t('profile.title')}
          </Button>
        </Link>
        <Link to="/history">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <History className="mr-2 h-5 w-5" />
            {t('history.title')}
          </Button>
        </Link>
        <Link to="/referral">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <UserPlus className="mr-2 h-5 w-5" />
            {t('referral.title')}
          </Button>
        </Link>
        <Link to="/tasks">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <Award className="mr-2 h-5 w-5" />
            {t('tasks.title')}
          </Button>
        </Link>
        <Link to="/mining/upgrades">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <Zap className="mr-2 h-5 w-5" />
            {t('mining.upgrades')}
          </Button>
        </Link>
        <Link to="/statistics">
          <Button variant="ghost" className="w-full justify-start text-indigo-100 hover:bg-gray-800">
            <BarChart2 className="mr-2 h-5 w-5" />
            {t('stats.title')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
