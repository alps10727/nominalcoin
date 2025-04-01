
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  // Adding display: none to hide this component
  return (
    <Link to="/statistics" className="hidden">
      <Button 
        className="w-full relative bg-gradient-to-r from-darkPurple-900 to-navy-800 hover:from-darkPurple-800 hover:to-navy-700 text-white shadow-lg border border-darkPurple-600/20 py-6 rounded-xl transition-all duration-300 group overflow-hidden"
        size="lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-indigo-500/5 to-purple-600/20 blur-sm opacity-0 group-hover:opacity-100 animate-pulse-gradient" style={{animationDuration: '3s'}}></div>
        
        <div className="flex items-center justify-between py-1 w-full relative z-10">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-navy-800/80 mr-3 border border-navy-600/20 group-hover:bg-navy-700/80 transition-colors duration-300">
              <BarChart2 className="h-5 w-5 text-darkPurple-300 group-hover:text-purple-300 transition-colors duration-300" />
            </div>
            <span className="text-lg font-medium bg-gradient-to-r from-darkPurple-300 to-navy-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-indigo-300 transition-all duration-300">
              {t('stats.title')}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-darkPurple-400 group-hover:text-purple-300 transition-colors duration-300">View</span>
            <ArrowRight className="h-5 w-5 text-darkPurple-300 bg-navy-800/50 p-0.5 rounded-full group-hover:bg-navy-700 group-hover:text-purple-300 transform group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
