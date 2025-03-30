
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChevronRight, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface MenuCardProps {
  title: string;
  icon: LucideIcon;
  to: string;
}

const MenuCard = ({ title, icon: Icon, to }: MenuCardProps) => {
  const isMobile = useIsMobile();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Link to={to}>
      <Card 
        className="border border-purple-500/20 shadow-sm hover:shadow-glow transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-xl backdrop-blur-sm"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Enhanced glass effect background */}
        <div className="absolute inset-0 bg-gradient-to-br from-darkPurple-800/80 via-navy-800/80 to-darkPurple-900/80 backdrop-blur-md"></div>
        
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-colors duration-700"></div>
        
        {/* Animated border glow */}
        <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/40 rounded-lg transition-colors duration-300"></div>
        
        {/* Left side accent with pulsing effect */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400/70 to-indigo-500/70 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
        
        {/* Animated particles on hover */}
        {isHovering && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 h-0.5 bg-white/80 rounded-full animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${Math.random() * 2 + 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        <CardHeader className={`${isMobile ? 'p-3' : 'p-4'} relative z-10`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-md'} flex justify-between items-center text-gray-100`}>
            <div className="flex items-center">
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-gradient-to-br from-darkPurple-700/70 to-navy-800/70 group-hover:from-darkPurple-600/90 group-hover:to-navy-700/90 transition-colors mr-2 border border-purple-500/30 backdrop-blur-lg group-hover:shadow-glow`}>
                <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-300 group-hover:text-white transition-colors duration-500`} />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-500 text-shadow font-medium">{title}</span>
            </div>
            <div className="flex items-center">
              <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-500/50 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-500`} />
              <Sparkles className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-purple-400/0 group-hover:text-purple-400/70 ml-0.5 transition-all duration-500`} />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
