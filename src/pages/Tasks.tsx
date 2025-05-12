
import { useState, useEffect } from "react";
import { useTasksData } from "@/components/tasks/TasksData";
import { useTasks } from "@/contexts/TasksContext";
import { useAuth } from "@/contexts/AuthContext";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { TasksError } from "@/components/tasks/TasksError";
import { TasksLoading } from "@/components/tasks/TasksLoading";
import { TasksContent } from "@/components/tasks/TasksContent";
import { debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

const Tasks = () => {
  const { dailyTasks, badges, claimReward, loading: tasksDataLoading } = useTasksData();
  const { error: tasksError, loading: tasksContextLoading, refreshTasks } = useTasks();
  const { userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Sayfa açıldığında görevleri yenile
  useEffect(() => {
    debugLog("Tasks", "Görevler yükleniyor...");
    refreshTasks().then(() => {
      debugLog("Tasks", "Görevler başarıyla yüklendi");
      toast.success("Görevler yüklendi", { duration: 2000 });
    }).catch(error => {
      debugLog("Tasks", "Görevler yüklenirken hata oluştu:", error);
    });
  }, [refreshTasks]);
  
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
        <TasksHeader />

        {tasksError && <TasksError error={tasksError} />}

        {isLoading && <TasksLoading />}

        {!isLoading && !tasksError && dailyTasks.length > 0 ? (
          <>
            <div className="mb-4 bg-teal-500/10 p-3 rounded-lg border border-teal-500/30">
              <p className="text-sm text-teal-200">
                {dailyTasks.length} görev bulundu. Görevleri tamamlayarak ödüller kazanabilirsiniz.
              </p>
            </div>
            <TasksContent
              dailyTasks={dailyTasks}
              badges={badges}
              currentPage={currentPage}
              totalPages={totalPages}
              currentTasks={currentTasks}
              onClaim={claimReward}
              onPageChange={goToPage}
            />
          </>
        ) : !isLoading && !tasksError ? (
          <div className="flex flex-col items-center justify-center p-10 bg-navy-800/50 border border-navy-700 rounded-lg">
            <p className="text-gray-300 mb-3">Henüz hiç görev bulunamadı.</p>
            <button 
              onClick={refreshTasks}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
            >
              Görevleri Yenile
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Tasks;
