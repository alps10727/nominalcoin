
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTaskItem from "@/components/tasks/DailyTaskItem";
import BadgeItem from "@/components/tasks/BadgeItem";
import { useTasksData } from "@/components/tasks/TasksData";

const Tasks = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { dailyTasks, badges, claimReward } = useTasksData();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('tasks.title')}</h1>
        </div>

        <Tabs defaultValue="daily" className="mb-6">
          <TabsList className="bg-gray-800 border-b border-gray-700 w-full rounded-lg mb-6">
            <TabsTrigger 
              value="daily" 
              className="flex-1 rounded-lg data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200"
            >
              {t('tasks.daily')}
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex-1 rounded-lg data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200"
            >
              {t('tasks.achievements')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="space-y-4">
              {dailyTasks.map(task => (
                <DailyTaskItem 
                  key={task.id} 
                  task={task} 
                  onClaim={claimReward} 
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map(badge => (
                <BadgeItem key={badge.id} badge={badge} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Tasks;
