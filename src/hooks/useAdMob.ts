
import { useState, useCallback, useRef } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);

  const showRewardAd = useCallback(async () => {
    if (isLoading) {
      console.log('Ad is already loading, ignoring request');
      return false;
    }
    
    setIsLoading(true);
    console.log('Starting to load reward ad');
    
    // Set a timeout to prevent infinite loading state if something goes wrong
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isLoading) {
        console.log('Ad loading timeout, resetting loading state');
        setIsLoading(false);
        toast.error('Reklam yüklenirken zaman aşımı oluştu. Lütfen tekrar deneyin.');
      }
    }, 30000); // 30 seconds timeout
    
    try {
      // Initialize AdMob if not already initialized
      await admobService.initialize();
      
      console.log('Showing reward ad');
      const rewarded = await admobService.showRewardAd();
      console.log('Ad completed with result:', rewarded);
      
      // Clear timeout since we got a response
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      if (rewarded) {
        toast.success('Reklam başarıyla gösterildi!');
      } else {
        toast.error('Reklam tamamlanmadı veya gösterilemedi. Lütfen tekrar deneyin.');
      }
      
      setIsLoading(false);
      return rewarded;
    } catch (error) {
      // Clear timeout since we got an error
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      console.error('Error showing reward ad:', error);
      toast.error('Reklam gösterilirken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
      
      // For development/testing, return true to allow functionality without ads
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: simulating successful ad view');
        return true;
      }
      
      return false;
    }
  }, [isLoading]);

  // Clean up timeout on unmount
  useCallback(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    showRewardAd,
    isLoading
  };
}
