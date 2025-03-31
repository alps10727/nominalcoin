
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics" className="block w-full">
      <Button 
        className="w-full relative bg-gradient-to-r from-purple-900 to-darkPurple-800 hover:from-purple-800 hover:to-darkPurple-700 text-white shadow-lg border-0 py-6 rounded-xl transition-all duration-300"
        size="lg"
      >
        <div className="flex items-center justify-between py-1 w-full">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-purple-800/80 mr-3 border border-purple-600/20">
              <BarChart2 className="h-5 w-5 text-purple-300" />
            </div>
            <span className="text-lg font-medium text-purple-300">{t('stats.title')}</span>
          </div>
          <ArrowRight className="h-5 w-5 text-purple-300 bg-purple-800/50 p-0.5 rounded-full" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
