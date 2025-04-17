
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debugUtils';
import { toast } from 'sonner';
import { UserData } from '@/utils/storage';

export function useDataUpgrader() {
  // Yükseltmeleri Supabase'e kaydetme
  const upgradeData = useCallback(async (
    userId: string, 
    upgradeId: number, 
    level: number = 1, 
    rateBonus: number = 0.001
  ): Promise<boolean> => {
    if (!userId) {
      errorLog('useDataUpgrader', 'Kullanıcı ID olmadan yükseltme yapılamaz');
      return false;
    }

    try {
      debugLog('useDataUpgrader', 'Yükseltme kaydediliyor:', {
        upgradeId,
        level,
        rateBonus
      });

      // Yükseltmenin daha önce satın alınıp alınmadığını kontrol et
      const { data: existingUpgrade } = await supabase
        .from('upgrades')
        .select('*')
        .eq('user_id', userId)
        .eq('upgrade_id', upgradeId)
        .single();

      if (existingUpgrade) {
        // Mevcut yükseltmeyi güncelle
        const { error: updateError } = await supabase
          .from('upgrades')
          .update({
            level: level > existingUpgrade.level ? level : existingUpgrade.level,
            rate_bonus: rateBonus
          })
          .eq('id', existingUpgrade.id);

        if (updateError) throw updateError;
      } else {
        // Yeni yükseltme ekle
        const { error: insertError } = await supabase
          .from('upgrades')
          .insert({
            upgrade_id: upgradeId,
            user_id: userId,
            level: level,
            rate_bonus: rateBonus
          });

        if (insertError) throw insertError;
      }

      debugLog('useDataUpgrader', 'Yükseltme başarıyla kaydedildi');
      return true;
    } catch (error) {
      errorLog('useDataUpgrader', 'Yükseltme kaydedilirken hata:', error);
      toast.error('Yükseltme kaydedilemedi, lütfen tekrar deneyin.');
      return false;
    }
  }, []);

  return { upgradeData };
}
