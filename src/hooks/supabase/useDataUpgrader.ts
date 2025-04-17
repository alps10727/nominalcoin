
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { toast } from 'sonner';

export function useDataUpgrader(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Yükseltme satın alma işlemi
   */
  const purchaseUpgrade = async (
    upgradeId: string, 
    level: number, 
    cost: number, 
    rateBonus: number,
    currentBalance: number
  ): Promise<boolean> => {
    if (!userId) {
      toast.error("Bu işlem için oturum açmanız gerekmektedir");
      return false;
    }

    if (currentBalance < cost) {
      toast.error("Yetersiz bakiye");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Adım 1: Yükseltmeyi ekle/güncelle
      const { error: upgradeError } = await supabase
        .from('upgrades')
        .upsert({
          user_id: userId,
          upgrade_id: upgradeId,
          level: level,
          rate_bonus: rateBonus,
        });
      
      if (upgradeError) throw upgradeError;
      
      // Adım 2: Bakiyeyi güncelle
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: currentBalance - cost,
          mining_rate: 0.003 + rateBonus // Yeni mining rate
        })
        .eq('id', userId);
      
      if (balanceError) throw balanceError;
      
      debugLog("useDataUpgrader", "Upgrade purchased successfully:", { upgradeId, level, cost, rateBonus });
      toast.success("Yükseltme satın alındı");
      return true;
    } catch (error) {
      errorLog("useDataUpgrader", "Error purchasing upgrade:", error);
      toast.error("Yükseltme satın alınırken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Görevleri tamamlama
   */
  const completeTask = async (taskId: number, reward: number, currentBalance: number): Promise<boolean> => {
    if (!userId) {
      toast.error("Bu işlem için oturum açmanız gerekmektedir");
      return false;
    }

    setIsLoading(true);
    
    try {
      // Adım 1: Görevi ekle
      const { error: taskError } = await supabase
        .from('completed_tasks')
        .upsert({
          user_id: userId,
          task_id: taskId
        });
      
      if (taskError) throw taskError;
      
      // Adım 2: Ödül ekle
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: currentBalance + reward 
        })
        .eq('id', userId);
      
      if (balanceError) throw balanceError;
      
      debugLog("useDataUpgrader", "Task completed successfully:", { taskId, reward });
      toast.success(`Görev tamamlandı: ${reward} NC kazandınız!`);
      return true;
    } catch (error) {
      errorLog("useDataUpgrader", "Error completing task:", error);
      toast.error("Görev tamamlanırken bir hata oluştu");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    purchaseUpgrade,
    completeTask,
    isLoading
  };
}
