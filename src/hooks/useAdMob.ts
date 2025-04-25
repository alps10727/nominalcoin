
import { useState, useCallback } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);

  const showRewardAd = useCallback(async () => {
    setIsLoading(true);
    try {
      const rewarded = await admobService.showRewardAd();
      setIsLoading(false);
      return rewarded;
    } catch (error) {
      console.error('Error showing reward ad:', error);
      toast.error('Reklam gösterilirken bir hata oluştu');
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    showRewardAd,
    isLoading
  };
}
