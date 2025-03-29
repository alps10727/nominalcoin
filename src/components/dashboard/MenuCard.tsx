
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuCardProps {
  title: string;
  icon: LucideIcon;
  to: string;
}

const MenuCard = ({ title, icon: Icon, to }: MenuCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Link to={to}>
      <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden">
        {/* Background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800/90 via-darkPurple-800/90 to-navy-900/90 backdrop-blur-sm"></div>
        
        {/* Border glow on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-darkPurple-500/50 rounded-lg transition-colors duration-300"></div>
        
        {/* Left side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-darkPurple-400/80 to-navy-500/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
        
        <CardHeader className={`${isMobile ? 'p-3' : 'p-4'} relative z-10`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-md'} flex justify-between items-center text-gray-100`}>
            <div className="flex items-center">
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-lg bg-gradient-to-br from-darkPurple-700/50 to-navy-800/50 group-hover:from-darkPurple-600/60 group-hover:to-navy-700/60 transition-colors mr-2 border border-darkPurple-500/20 backdrop-blur-sm`}>
                <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-darkPurple-300 group-hover:text-darkPurple-200 transition-colors`} />
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">{title}</span>
            </div>
            <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-darkPurple-500/70 group-hover:text-darkPurple-400 group-hover:translate-x-0.5 transition-all duration-300`} />
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
