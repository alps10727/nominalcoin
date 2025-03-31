
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics" className="block w-full">
      <Button 
        className="w-full relative bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-lg border-0 py-6 rounded-xl transition-all duration-300"
        size="lg"
      >
        <div className="flex items-center justify-between py-1 w-full">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-purple-600/80 mr-3 border border-purple-400/20">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-white">{t('stats.title')}</span>
              <span className="text-xs text-purple-200">View detailed analytics</span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-purple-200 bg-purple-600/50 p-0.5 rounded-full" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
