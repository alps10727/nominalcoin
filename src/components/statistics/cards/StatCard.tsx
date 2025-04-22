
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  label: string;
  value: string;
}

const StatCard = ({ icon: Icon, iconColor, bgColor, label, value }: StatCardProps) => {
  return (
    <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
      <CardContent className="p-4 flex flex-col items-center">
        <div className={`p-2 rounded-full ${bgColor} mb-2`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
