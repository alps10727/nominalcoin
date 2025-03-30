
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
        className="w-full relative overflow-hidden group bg-gradient-to-br from-darkPurple-700/90 via-navy-800/90 to-darkPurple-800/90 hover:from-darkPurple-600/90 hover:via-navy-700/90 hover:to-darkPurple-700/90 text-white shadow-lg transition-all hover:shadow-xl border border-purple-500/20 py-6 backdrop-blur-sm rounded-xl"
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
        
        {/* Orbital particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-300/60"
              style={{
                top: `${50 + 30 * Math.cos(Math.PI * 2 * i / 3)}%`,
                left: `${50 + 30 * Math.sin(Math.PI * 2 * i / 3)}%`,
                animation: `orbit ${6 + i}s linear infinite`
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="flex items-center justify-center relative z-10 py-1">
          <div className="flex items-center mr-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-darkPurple-600/80 to-navy-700/80 group-hover:from-darkPurple-500/80 group-hover:to-navy-600/80 transition-colors mr-3 border border-purple-500/20 backdrop-blur-sm group-hover:shadow-glow">
              <BarChart2 className="h-5 w-5 text-purple-300 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium group-hover:translate-x-0.5 transition-transform duration-300 text-white">{t('stats.title')}</span>
              <span className="text-xs text-purple-300/70">View detailed analytics</span>
            </div>
          </div>
          <div className="flex items-center ml-4">
            <ArrowRight className="ml-1 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            <Sparkles className="ml-1 h-3 w-3 text-purple-300/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
