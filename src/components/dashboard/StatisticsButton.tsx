
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const StatisticsButton = () => {
  const { t } = useLanguage();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Link to="/statistics">
      <Button 
        className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-800 to-indigo-900 hover:from-violet-700 hover:to-indigo-800 text-white shadow-md transition-all hover:shadow-lg border-none py-6"
        size="lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background effects */}
        <div className="absolute inset-0 flex justify-between overflow-hidden opacity-20">
          <div className="w-1/3 h-full bg-white/5 skew-x-12 transform -translate-x-full group-hover:translate-x-[150%] transition-transform duration-1000"></div>
        </div>
        
        {/* Sparkles effect (enhanced on hover) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-1 w-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-3/4 left-1/3 h-1 w-1 bg-white rounded-full animate-ping" style={{ animationDuration: '2.3s', animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/3 left-2/3 h-1 w-1 bg-white rounded-full animate-ping" style={{ animationDuration: '2.7s', animationDelay: '0.5s' }}></div>
          <div className="absolute top-2/3 left-1/5 h-1.5 w-1.5 bg-violet-300 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.7s' }}></div>
          <div className="absolute top-1/2 left-3/4 h-1.5 w-1.5 bg-indigo-300 rounded-full animate-ping" style={{ animationDuration: '3.2s', animationDelay: '0.9s' }}></div>
        </div>
        
        {/* Energy wave effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isHovering ? 'animate-[sheen_1s_ease_forwards]' : ''}`}></div>
        
        {/* Content */}
        <div className="flex items-center justify-center relative z-10 py-1">
          <div className="flex items-center mr-2">
            <div className="p-1 rounded-full bg-white/10 mr-2 group-hover:bg-white/20 transition-colors">
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
