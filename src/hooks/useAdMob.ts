
import { useState, useCallback } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);

  const showRewardAd = useCallback(async () => {
    if (isLoading) {
      console.log('Ad is already loading, ignoring request');
      return false;
    }
    
    setIsLoading(true);
    console.log('Starting to load reward ad');
    
    try {
      // Initialize AdMob if not already initialized
      await admobService.initialize();
      
      console.log('Showing reward ad');
      const rewarded = await admobService.showRewardAd();
      console.log('Ad completed with result:', rewarded);
      
      if (rewarded) {
        toast.success('Reklam başarıyla gösterildi!');
      } else {
        toast.error('Reklam tamamlanmadı veya gösterilemedi');
      }
      
      setIsLoading(false);
      return rewarded;
    } catch (error) {
      console.error('Error showing reward ad:', error);
      toast.error('Reklam gösterilirken bir hata oluştu');
      setIsLoading(false);
      
      // For development/testing, return true to allow functionality without ads
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: simulating successful ad view');
        return true;
      }
      
      return false;
    }
  }, [isLoading]);

  return {
    showRewardAd,
    isLoading
  };
}
