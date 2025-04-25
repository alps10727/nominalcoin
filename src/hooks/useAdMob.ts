
import { useCallback } from 'react';
import { admobService } from '@/services/admob/admobService';

export function useAdMob() {
  const showRewardAd = useCallback(async () => {
    try {
      await admobService.initialize();
      const rewarded = await admobService.showRewardAd();
      return rewarded;
    } catch (error) {
      console.error('Error showing reward ad:', error);
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      return false;
    }
  }, []);

  return {
    showRewardAd
  };
}
