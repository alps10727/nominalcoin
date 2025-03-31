
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics">
      <Button 
        className="w-full relative overflow-hidden group bg-gradient-to-br from-darkPurple-700/90 via-navy-700/90 to-darkPurple-700/90 hover:from-darkPurple-600/90 hover:via-navy-600/90 hover:to-darkPurple-600/90 text-white shadow-md border border-purple-500/30 py-6 rounded-xl"
        size="lg"
      >
        {/* Content */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center mr-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-darkPurple-600/80 to-navy-700/80 group-hover:from-darkPurple-500/90 group-hover:to-navy-600/90 transition-colors mr-3 border border-purple-500/30">
              <BarChart2 className="h-5 w-5 text-purple-200 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-white">{t('stats.title')}</span>
              <span className="text-xs text-purple-300/70">View detailed analytics</span>
            </div>
          </div>
          <ArrowRight className="ml-4 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
