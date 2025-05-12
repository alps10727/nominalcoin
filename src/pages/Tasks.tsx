
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
  const { dailyTasks, badges, claimReward, loading: tasksDataLoading, error: tasksDataError } = useTasksData();
  const { error: tasksError, loading: tasksContextLoading, refreshTasks } = useTasks();
  const { userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Sayfa açıldığında görevleri yenile
  useEffect(() => {
    console.log("Tasks sayfası yükleniyor, görev yükleme devre dışı.");
    debugLog("Tasks", "Görev yükleme devre dışı bırakıldı");
    toast.success("Görev listesi temizlendi", { duration: 2000 });
  }, []);
  
  // Always use empty task list
  const currentTasks: any[] = [];
  const totalPages = 0;

  const goToPage = (pageNumber: number) => {
    // No-op since there are no pages
  };

  const isLoading = false;
  const error = null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <TasksHeader />

        <div className="flex flex-col items-center justify-center p-10 bg-navy-800/50 border border-navy-700 rounded-lg">
          <p className="text-gray-300 mb-3">Görevler şu an için devre dışı bırakılmıştır.</p>
          <button 
            onClick={refreshTasks}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            Yenile
          </button>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
