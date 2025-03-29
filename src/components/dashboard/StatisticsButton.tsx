
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const StatisticsButton = () => {
  const { t } = useLanguage();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Link to="/statistics">
      <Button 
        className="w-full relative overflow-hidden group bg-gradient-to-r from-darkPurple-700/90 to-navy-700/90 hover:from-darkPurple-600/90 hover:to-navy-600/90 text-white shadow-md transition-all hover:shadow-lg border-none py-6"
        size="lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Glass effect */}
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-darkPurple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Energy wave effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isHovering ? 'animate-sheen' : ''}`}></div>
        
        {/* Content */}
        <div className="flex items-center justify-center relative z-10 py-1">
          <div className="flex items-center mr-2">
            <div className="p-1.5 rounded-full bg-darkPurple-600/80 mr-2 group-hover:bg-darkPurple-500/80 transition-colors">
              <BarChart2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-medium">{t('stats.title')}</span>
          </div>
          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
