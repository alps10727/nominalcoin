
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/types/tasks";

interface BadgeItemProps {
  badge: Badge;
}

const BadgeItem = ({ badge }: BadgeItemProps) => {
  return (
    <Card className={`border-none shadow-md text-gray-100 dark:bg-gray-850 overflow-hidden ${badge.earned ? 'bg-gradient-to-br from-gray-800 to-indigo-900/50' : 'bg-gray-800'}`}>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <div className={`p-2 rounded-lg ${badge.earned ? 'bg-indigo-900/50' : 'bg-gray-700'} mr-3`}>
            {badge.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-200">{badge.title}</h3>
            <p className="text-xs text-gray-400">{badge.description}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{badge.earned ? 'Earned' : 'Progress'}</span>
            <span>{badge.progress}%</span>
          </div>
          <Progress value={badge.progress} className="h-2 bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeItem;
