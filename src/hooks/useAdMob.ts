
import { useState, useCallback, useRef, useEffect } from 'react';
import { admobService } from '@/services/admob/admobService';
import { toast } from 'sonner';

export function useAdMob() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);
  const mounted = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);

  const showRewardAd = useCallback(async () => {
    if (isLoading) {
      console.log('Ad is already loading, ignoring request');
      return false;
    }
    
    // Reset error state
    setError(null);
    setIsLoading(true);
    console.log('Starting to load reward ad');
    
    // Set a timeout to prevent infinite loading state if something goes wrong
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (mounted.current && isLoading) {
        console.log('Ad loading timeout, resetting loading state');
        setIsLoading(false);
        setError('Zaman aşımı oluştu');
        toast.error('Reklam yüklenirken zaman aşımı oluştu. Lütfen tekrar deneyin.');
      }
    }, 15000); // 15 seconds timeout (reduced from 30)
    
    try {
      // Initialize AdMob if not already initialized
      await admobService.initialize();
      
      console.log('Showing reward ad');
      const rewarded = await admobService.showRewardAd();
      console.log('Ad completed with result:', rewarded);
      
      // Only update state if component is still mounted
      if (mounted.current) {
        // Clear timeout since we got a response
        if (loadingTimeoutRef.current) {
          window.clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        if (rewarded) {
          toast.success('Reklam başarıyla gösterildi!');
        } else {
          setError('Reklam tamamlanmadı');
          toast.error('Reklam tamamlanmadı veya gösterilemedi. Lütfen tekrar deneyin.');
        }
        
        setIsLoading(false);
      }
      
      return rewarded;
    } catch (error) {
      // Only update state if component is still mounted
      if (mounted.current) {
        // Clear timeout since we got an error
        if (loadingTimeoutRef.current) {
          window.clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        console.error('Error showing reward ad:', error);
        setError('Reklam gösterilirken hata oluştu');
        toast.error('Reklam gösterilirken bir hata oluştu. Lütfen tekrar deneyin.');
        setIsLoading(false);
      }
      
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
    isLoading,
    error
  };
}
