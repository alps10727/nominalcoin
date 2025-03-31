
import { Card } from "@/components/ui/card";
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
      <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90">
        {/* Left side accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/70 to-indigo-500/70"></div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} relative z-10 flex justify-between items-center text-gray-100`}>
          <div className="flex items-center">
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-gradient-to-br from-gray-700/70 to-gray-800/70 mr-2 border border-blue-500/20`}>
              <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-300`} />
            </div>
            <span className={`${isMobile ? 'text-sm' : 'text-md'} font-medium`}>{title}</span>
          </div>
          <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-400/50 group-hover:text-blue-300 transition-colors duration-300`} />
        </div>
      </Card>
    </Link>
  );
};

export default MenuCard;
