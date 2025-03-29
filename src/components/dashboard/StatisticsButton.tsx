
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
        className="w-full relative overflow-hidden group bg-purple-900 hover:bg-purple-800 text-white shadow-md transition-all hover:shadow-lg border-none py-6"
        size="lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background effects */}
        <div className="absolute inset-0 flex justify-between overflow-hidden opacity-20">
          <div className="w-1/3 h-full bg-white/5 skew-x-12 transform -translate-x-full group-hover:translate-x-[150%] transition-transform duration-1000"></div>
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
