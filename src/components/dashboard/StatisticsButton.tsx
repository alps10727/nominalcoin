
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics">
      <Button 
        className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-800 to-indigo-900 hover:from-violet-700 hover:to-indigo-800 text-white shadow-md transition-all hover:shadow-lg border-none py-6"
        size="lg"
      >
        {/* Background effects */}
        <div className="absolute inset-0 flex justify-between overflow-hidden opacity-20">
          <div className="w-1/3 h-full bg-white/5 skew-x-12 transform -translate-x-full group-hover:translate-x-[150%] transition-transform duration-1000"></div>
        </div>
        
        {/* Sparkles effect (only visible on hover) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-1 w-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-3/4 left-1/3 h-1 w-1 bg-white rounded-full animate-ping" style={{ animationDuration: '2.3s', animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/3 left-2/3 h-1 w-1 bg-white rounded-full animate-ping" style={{ animationDuration: '2.7s', animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Content */}
        <div className="flex items-center justify-center relative z-10 py-1">
          <div className="flex items-center mr-2">
            <div className="p-1 rounded-full bg-white/10 mr-2">
              <BarChart2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-medium">{t('stats.title')}</span>
          </div>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
