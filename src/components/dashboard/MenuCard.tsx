
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
      <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gray-800/90 backdrop-blur-sm hover:bg-gray-800 text-gray-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 group-hover:from-indigo-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
        <CardHeader className={`${isMobile ? 'p-3' : 'p-4'} relative z-10`}>
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-md'} flex justify-between items-center`}>
            <div className="flex items-center">
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-2 shadow-md`}>
                <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-indigo-400`} />
              </div>
              <span>{title}</span>
            </div>
            <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500 group-hover:text-indigo-400 transition-colors`} />
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
