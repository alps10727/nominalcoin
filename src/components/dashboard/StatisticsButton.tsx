
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics" className="block w-full">
      <Button 
        className="w-full relative bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg border-0 py-6 rounded-xl"
        size="lg"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/5"></div>
          <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-blue-500/5"></div>
        </div>
        
        <div className="flex items-center justify-center py-1 z-10 relative">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-indigo-600/80 mr-3 border border-indigo-400/20">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium text-white">{t('stats.title')}</span>
              <span className="text-xs text-indigo-200">View detailed analytics</span>
            </div>
          </div>
          <ArrowRight className="ml-4 h-4 w-4 text-indigo-200" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
