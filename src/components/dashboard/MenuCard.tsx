
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
      <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800/95 via-darkPurple-800/95 to-navy-900/95 opacity-90 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Hover effect - left border highlight */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-darkPurple-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0tMjAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTQwIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Wm0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00WiIvPjwvZz48L2c+PC9zdmc+')] bg-fixed opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500 backdrop-blur-sm"></div>
        
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
