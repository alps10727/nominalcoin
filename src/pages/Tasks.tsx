
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTaskItem from "@/components/tasks/DailyTaskItem";
import BadgeItem from "@/components/tasks/BadgeItem";
import { useTasksData } from "@/components/tasks/TasksData";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTasks } from "@/contexts/TasksContext";
import { useAuth } from "@/contexts/AuthContext";
import AdminTaskForm from "@/components/admin/AdminTaskForm";

const Tasks = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { dailyTasks, badges, claimReward, loading: tasksDataLoading } = useTasksData();
  const { error: tasksError, loading: tasksContextLoading } = useTasks();
  const { currentUser, userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = dailyTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(dailyTasks.length / itemsPerPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const isLoading = tasksDataLoading || tasksContextLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('tasks.title')}</h1>
        </div>

        {userData?.isAdmin && <AdminTaskForm />}

        {tasksError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 mb-6 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{tasksError}</p>
              <p className="text-sm mt-1 opacity-80">
                {t('tasks.errorRetry')}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                onClick={() => window.location.reload()}
              >
                {t('common.retry')}
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
            <span className="ml-3 text-teal-100">{t('common.loading')}...</span>
          </div>
        )}

        {!isLoading && !tasksError && (
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

            <TabsContent value="daily">
              <div className="space-y-4">
                {currentTasks.length > 0 ? (
                  currentTasks.map(task => (
                    <DailyTaskItem 
                      key={task.id} 
                      task={task} 
                      onClaim={claimReward} 
                    />
                  ))
                ) : (
                  <Card className="bg-navy-800/50 border-navy-700 text-center p-8">
                    <p className="text-gray-300">{t('tasks.noTasksAvailable')}</p>
                  </Card>
                )}
                
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => goToPage(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            onClick={() => goToPage(index + 1)}
                            isActive={currentPage === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => goToPage(currentPage + 1)} 
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
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
        )}
      </main>
    </div>
  );
};

export default Tasks;
