
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
        className="w-full relative overflow-hidden group bg-gradient-to-br from-darkPurple-700/90 via-navy-700/90 to-darkPurple-700/90 hover:from-darkPurple-600/90 hover:via-navy-600/90 hover:to-darkPurple-600/90 text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01] border border-purple-500/30 py-6 backdrop-blur-lg rounded-xl"
        size="lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Enhanced glass effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-br from-purple-600/5 to-navy-600/5"></div>
        
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-purple-500/10 animate-pulse-slow"></div>
        </div>
        
        {/* Energy wave effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isHovering ? 'animate-sheen' : ''}`}></div>
        
        {/* Orbital particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-300/60"
              style={{
                top: `${50 + 30 * Math.cos(Math.PI * 2 * i / 5)}%`,
                left: `${50 + 30 * Math.sin(Math.PI * 2 * i / 5)}%`,
                animation: `orbit ${5 + i * 0.5}s linear infinite`
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="flex items-center justify-center relative z-10 py-1">
          <div className="flex items-center mr-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-darkPurple-600/80 to-navy-700/80 group-hover:from-darkPurple-500/90 group-hover:to-navy-600/90 transition-colors mr-3 border border-purple-500/30 backdrop-blur-lg group-hover:shadow-glow">
              <BarChart2 className="h-5 w-5 text-purple-200 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-medium group-hover:translate-x-1 transition-transform duration-500 text-white">{t('stats.title')}</span>
              <span className="text-xs text-purple-300/70">View detailed analytics</span>
            </div>
          </div>
          <div className="flex items-center ml-4">
            <ArrowRight className="ml-1 h-4 w-4 opacity-70 group-hover:translate-x-1.5 group-hover:opacity-100 transition-all duration-500" />
            <Sparkles className="ml-1 h-3 w-3 text-purple-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
