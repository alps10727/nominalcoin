
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface MenuCardProps {
  title: string;
  icon: LucideIcon;
  to: string;
}

const MenuCard = ({ title, icon: Icon, to }: MenuCardProps) => {
  return (
    <Link to={to}>
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group bg-gray-800 text-gray-100 dark:bg-gray-850">
        <CardHeader className="p-4">
          <CardTitle className="text-md flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-gray-700 group-hover:bg-indigo-900 transition-colors mr-3">
                <Icon className="h-5 w-5 text-indigo-400" />
              </div>
              <span>{title}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default MenuCard;
