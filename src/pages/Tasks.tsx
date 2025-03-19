
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  progress: number;
  totalRequired: number;
  completed: boolean;
}

interface Badge {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  earned: boolean;
  progress: number;
}

const Tasks = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Mine for 5 minutes",
      description: "Keep mining active for at least 5 minutes",
      reward: 1,
      progress: 3,
      totalRequired: 5,
      completed: false
    },
    {
      id: 2,
      title: "Visit the Profile Page",
      description: "Check out your profile",
      reward: 0.5,
      progress: 1,
      totalRequired: 1,
      completed: true
    },
    {
      id: 3,
      title: "Invite a Friend",
      description: "Share your referral code with a friend",
      reward: 2,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1,
      title: "First Miner",
      description: "Complete your first mining session",
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      earned: true,
      progress: 100
    },
    {
      id: 2,
      title: "Mining Pro",
      description: "Mine for a total of 1 hour",
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
      earned: false,
      progress: 45
    },
    {
      id: 3,
      title: "Social Networker",
      description: "Refer 5 friends to FC",
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      earned: false,
      progress: 40
    },
    {
      id: 4,
      title: "Upgrade Master",
      description: "Purchase 3 mining upgrades",
      icon: <CheckCheck className="h-6 w-6 text-purple-400" />,
      earned: false,
      progress: 33
    },
  ]);

  const claimReward = (taskId: number) => {
    const taskIndex = dailyTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        const newTasks = [...dailyTasks];
        newTasks[taskIndex] = { ...task, completed: true };
        setDailyTasks(newTasks);
        
        toast({
          title: "Reward Claimed!",
          description: `You earned ${task.reward} FC from ${task.title}`,
        });
      }
    }
  };

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
                <Card key={task.id} className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-200">{task.title}</h3>
                        <p className="text-sm text-gray-400">{task.description}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 font-medium mr-2">+{task.reward} FC</span>
                        {task.completed ? (
                          <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-md">
                            {t('tasks.completed')}
                          </span>
                        ) : (
                          task.progress >= task.totalRequired ? (
                            <Button 
                              size="sm" 
                              className="bg-indigo-600 hover:bg-indigo-700 h-8"
                              onClick={() => claimReward(task.id)}
                            >
                              {t('tasks.claim')}
                            </Button>
                          ) : (
                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md">
                              {t('tasks.progress')}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    {!task.completed && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}/{task.totalRequired}</span>
                        </div>
                        <Progress value={(task.progress / task.totalRequired) * 100} className="h-2 bg-gray-700" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map(badge => (
                <Card key={badge.id} className={`border-none shadow-md text-gray-100 dark:bg-gray-850 overflow-hidden ${badge.earned ? 'bg-gradient-to-br from-gray-800 to-indigo-900/50' : 'bg-gray-800'}`}>
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
