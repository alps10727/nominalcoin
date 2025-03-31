
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
      <Card className="border-0 shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-indigo-500/10"></div>
          <div className="absolute -left-2 -top-2 w-10 h-10 rounded-full bg-blue-400/5"></div>
        </div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} relative z-10 flex justify-between items-center text-white`}>
          <div className="flex items-center">
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-indigo-700/60 mr-3 border border-indigo-500/30`}>
              <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-indigo-200`} />
            </div>
            <span className={`${isMobile ? 'text-sm' : 'text-md'} font-medium`}>{title}</span>
          </div>
          <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-indigo-300/80 group-hover:text-white transition-colors duration-300`} />
        </div>
      </Card>
    </Link>
  );
};

export default MenuCard;
