
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
        className="border-none shadow-sm hover:shadow-glow transition-all duration-300 cursor-pointer group relative overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800/90 via-darkPurple-800/90 to-navy-900/90 backdrop-blur-sm"></div>
        
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30 nebula-bg"></div>
        
        {/* Border glow on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-darkPurple-500/50 rounded-lg transition-colors duration-300"></div>
        
        {/* Left side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-darkPurple-400/80 to-navy-500/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
        
        {/* Particle effect on hover */}
        {isHovering && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 h-0.5 bg-white/80 rounded-full animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <CardHeader className={`${isMobile ? 'p-3' : 'p-4'} relative z-10`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-md'} flex justify-between items-center text-gray-100`}>
            <div className="flex items-center">
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-lg bg-gradient-to-br from-darkPurple-700/50 to-navy-800/50 group-hover:from-darkPurple-600/60 group-hover:to-navy-700/60 transition-colors mr-2 border border-darkPurple-500/20 backdrop-blur-sm group-hover:shadow-glow`}>
                <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-darkPurple-300 group-hover:text-white transition-colors`} />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-300 text-shadow">{title}</span>
            </div>
            <div className="flex items-center">
              <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-darkPurple-500/70 group-hover:text-darkPurple-300 group-hover:translate-x-0.5 transition-all duration-300`} />
              <Sparkles className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-darkPurple-400/0 group-hover:text-darkPurple-400/70 ml-0.5 transition-all duration-300`} />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
