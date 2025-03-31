
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics" className="block w-full">
      <Button 
        className="w-full relative bg-gradient-to-r from-blue-900 to-navy-800 hover:from-blue-800 hover:to-navy-700 text-white shadow-lg border-0 py-6 rounded-xl transition-all duration-300"
        size="lg"
      >
        <div className="flex items-center justify-between py-1 w-full">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-blue-800/80 mr-3 border border-blue-600/20">
              <BarChart2 className="h-5 w-5 text-teal-300" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-teal-300">{t('stats.title')}</span>
              <span className="text-xs text-blue-200">View detailed analytics</span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-teal-300 bg-blue-800/50 p-0.5 rounded-full" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
