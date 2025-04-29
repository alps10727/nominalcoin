
import { Task } from "@/types/tasks";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTaskItem from "@/components/tasks/DailyTaskItem";
import BadgeItem from "@/components/tasks/BadgeItem";
import { TasksPagination } from "./TasksPagination";
import BannerAdContainer from "@/components/ads/BannerAdContainer";

interface TasksContentProps {
  dailyTasks: Task[];
  badges: any[];
  currentPage: number;
  totalPages: number;
  currentTasks: Task[];
  onClaim: (taskId: string | number) => void;
  onPageChange: (page: number) => void;
}

export const TasksContent = ({
  dailyTasks,
  badges,
  currentPage,
  totalPages,
  currentTasks,
  onClaim,
  onPageChange
}: TasksContentProps) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="daily" className="mb-6">
      <TabsList className="bg-navy-800 border-b border-navy-700 w-full rounded-lg mb-6">
        <TabsTrigger 
          value="daily" 
          className="flex-1 rounded-lg data-[state=active]:bg-teal-900/50 data-[state=active]:text-teal-200"
        >
          {t('tasks.daily')}
        </TabsTrigger>
        <TabsTrigger 
          value="achievements" 
          className="flex-1 rounded-lg data-[state=active]:bg-teal-900/50 data-[state=active]:text-teal-200"
        >
          {t('tasks.achievements')}
        </TabsTrigger>
      </TabsList>

      {/* Banner Ad Container */}
      <BannerAdContainer />

      <TabsContent value="daily">
        <div className="space-y-4">
          {currentTasks.length > 0 ? (
            currentTasks.map(task => (
              <DailyTaskItem 
                key={task.id} 
                task={task} 
                onClaim={onClaim} 
              />
            ))
          ) : (
            <Card className="bg-navy-800/50 border-navy-700 text-center p-8">
              <p className="text-gray-300">{t('tasks.noTasksAvailable')}</p>
            </Card>
          )}
          
          <TasksPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="achievements">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map(badge => (
            <BadgeItem key={badge.id} badge={badge} />
          ))}
        </div>
      </TabsContent>

      {/* Banner Ad Container at the bottom too */}
      <BannerAdContainer className="mt-6" />
    </Tabs>
  );
};
