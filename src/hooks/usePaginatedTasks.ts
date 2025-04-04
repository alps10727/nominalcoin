
import { useState, useEffect } from "react";
import { fetchPaginatedData, PaginationResult } from "@/services/paginatedDataService";
import { Task } from "@/types/tasks";
import { useAuthState } from "@/hooks/useAuthState";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { debugLog } from "@/utils/debugUtils";

export function usePaginatedTasks(pageSize: number = 5) {
  const { currentUser } = useAuthState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // İlk sayfayı yükle
  const loadInitialTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const result = await fetchPaginatedData<Task>(
        "tasks",
        pageSize,
        null,
        "createdAt",
        "desc"
      );
      
      setTasks(result.items);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      setCurrentPage(1);
    } catch (error) {
      debugLog("usePaginatedTasks", "Görevler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sonraki sayfayı yükle
  const loadMoreTasks = async () => {
    if (!currentUser || !lastDoc || !hasMore || loading) return;
    
    setLoading(true);
    try {
      const result = await fetchPaginatedData<Task>(
        "tasks",
        pageSize,
        lastDoc,
        "createdAt",
        "desc"
      );
      
      setTasks(prev => [...prev, ...result.items]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      debugLog("usePaginatedTasks", "Sonraki görevler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // Önceki sayfaya dön (yeniden yükleme gerektirir)
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      loadInitialTasks();
      // Not: Bu basit implementasyon ilk sayfaya döner. Gerçek önceki sayfa için daha karmaşık bir çözüm gerekir.
    }
  };

  // Sayfa değiştir
  const goToPage = (page: number) => {
    if (page === currentPage) return;
    
    if (page === 1) {
      loadInitialTasks();
    } else {
      // Not: Belirli bir sayfaya atlamak için ekstra işlevsellik gerekir
      // Bu basit implementasyon sadece ilk sayfaya dönmeyi destekler
      loadInitialTasks();
    }
  };

  // Görev tamamlandı olarak işaretle
  const markTaskCompleted = (taskId: string | number) => {
    setTasks(prev => 
      prev.map(task => 
        task.id.toString() === taskId.toString() 
          ? { ...task, completed: true } 
          : task
      )
    );
  };

  // Kullanıcı değiştiğinde verileri yükle
  useEffect(() => {
    if (currentUser) {
      loadInitialTasks();
    } else {
      setTasks([]);
      setLastDoc(null);
      setHasMore(false);
    }
  }, [currentUser]);

  return {
    tasks,
    loading,
    hasMore,
    currentPage,
    loadMoreTasks,
    goToPreviousPage,
    goToPage,
    markTaskCompleted
  };
}
