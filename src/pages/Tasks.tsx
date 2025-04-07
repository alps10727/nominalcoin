
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTaskItem from "@/components/tasks/DailyTaskItem";
import BadgeItem from "@/components/tasks/BadgeItem";
import { useTasksData } from "@/hooks/useTasksData";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";

const Tasks = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { dailyTasks, badges, claimReward } = useTasksData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Mevcut görevleri sayfalandırma için bölme
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = dailyTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(dailyTasks.length / itemsPerPage);

  // Sayfa değiştirme fonksiyonları
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('tasks.title')}</h1>
        </div>

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
              {currentTasks.map(task => (
                <DailyTaskItem 
                  key={task.id} 
                  task={task} 
                  onClaim={claimReward} 
                />
              ))}
              
              {/* Sayfalandırma bileşeni */}
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
      </main>
    </div>
  );
};

export default Tasks;
