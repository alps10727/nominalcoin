
import { useState, useEffect } from "react";
import { useTasksData } from "@/components/tasks/TasksData";
import { useTasks } from "@/contexts/TasksContext";
import { useAuth } from "@/contexts/AuthContext";
import { TasksHeader } from "@/components/tasks/TasksHeader";
import { TasksError } from "@/components/tasks/TasksError";
import { TasksLoading } from "@/components/tasks/TasksLoading";
import { TasksContent } from "@/components/tasks/TasksContent";

const Tasks = () => {
  const { dailyTasks, badges, claimReward, loading: tasksDataLoading } = useTasksData();
  const { error: tasksError, loading: tasksContextLoading, refreshTasks } = useTasks();
  const { userData } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Sayfa açıldığında görevleri yenile
  useEffect(() => {
    refreshTasks();
  }, []);
  
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

        {!isLoading && !tasksError && (
          <TasksContent
            dailyTasks={dailyTasks}
            badges={badges}
            currentPage={currentPage}
            totalPages={totalPages}
            currentTasks={currentTasks}
            onClaim={claimReward}
            onPageChange={goToPage}
          />
        )}
      </main>
    </div>
  );
};

export default Tasks;
