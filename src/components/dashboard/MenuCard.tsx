
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
      <Card className="border border-purple-500/20 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden rounded-xl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-darkPurple-800/90 via-navy-800/90 to-darkPurple-900/90"></div>
        
        {/* Left side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400/70 to-indigo-500/70"></div>
        
        <CardHeader className={`${isMobile ? 'p-3' : 'p-4'} relative z-10`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-md'} flex justify-between items-center text-gray-100`}>
            <div className="flex items-center">
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-gradient-to-br from-darkPurple-700/70 to-navy-800/70 mr-2 border border-purple-500/30`}>
                <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-300`} />
              </div>
              <span className="font-medium">{title}</span>
            </div>
            <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-500/50 group-hover:text-purple-300 transition-colors duration-300`} />
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
