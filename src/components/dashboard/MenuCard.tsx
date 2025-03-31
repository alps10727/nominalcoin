
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
      <Card className="border-0 shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-900/80 hover:to-indigo-900/80">
        <div className={`${isMobile ? 'p-3' : 'p-4'} relative z-10 flex justify-between items-center text-white`}>
          <div className="flex items-center">
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-purple-500/30 mr-3 border border-purple-400/20`}>
              <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-200`} />
            </div>
            <span className={`${isMobile ? 'text-sm' : 'text-md'} font-medium`}>{title}</span>
          </div>
          <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-300/80 group-hover:text-white transition-colors duration-300`} />
        </div>
      </Card>
    </Link>
  );
};

export default MenuCard;
