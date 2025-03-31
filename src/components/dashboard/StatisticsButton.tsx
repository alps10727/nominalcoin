
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics" className="block w-full">
      <Button 
        className="w-full relative bg-gradient-to-r from-darkPurple-900 to-navy-800 hover:from-darkPurple-800 hover:to-navy-700 text-white shadow-lg border border-darkPurple-600/20 py-6 rounded-xl transition-all duration-300"
        size="lg"
      >
        <div className="flex items-center justify-between py-1 w-full">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-navy-800/80 mr-3 border border-navy-600/20">
              <BarChart2 className="h-5 w-5 text-darkPurple-300" />
            </div>
            <span className="text-lg font-medium bg-gradient-to-r from-darkPurple-300 to-navy-300 bg-clip-text text-transparent">
              {t('stats.title')}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-darkPurple-400">View</span>
            <ArrowRight className="h-5 w-5 text-darkPurple-300 bg-navy-800/50 p-0.5 rounded-full" />
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
