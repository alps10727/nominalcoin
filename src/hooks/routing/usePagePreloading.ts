
import { useEffect } from 'react';
import { debugLog } from '@/utils/debugUtils';

/**
 * Reduces perceived loading time by preloading pages in the background
 */
export function usePagePreloading() {
  useEffect(() => {
    let isMounted = true;

    const preloadPages = async () => {
      // Delay preloading to prioritize initial render
      setTimeout(async () => {
        if (!isMounted) return;

        try {
          // Preload pages in the background with minimal priority
          const pagesToPreload = [
            () => import('@/pages/Profile'),
            () => import('@/pages/MiningUpgrades'),
            () => import('@/pages/Tasks'),
            () => import('@/pages/Statistics'),
            () => import('@/pages/History'),
          ];

          // Use Promise.all to load in parallel with low priority
          await Promise.all(
            pagesToPreload.map(importFunc => {
              // Add a small delay between each import to prevent resource contention
              return new Promise(resolve => {
                setTimeout(() => {
                  importFunc().then(resolve);
                }, Math.random() * 1000); // Randomize delay up to 1 second
              });
            })
          );

          if (isMounted) {
            debugLog('usePagePreloading', 'Sayfalar daha hızlı gezinme için önceden yüklendi');
          }
        } catch (error) {
          // Silent fail for preloading - non-critical operation
          console.error('Page preloading error:', error);
        }
      }, 2000); // Wait 2 seconds after initial render
    };

    preloadPages();

    return () => {
      isMounted = false;
    };
  }, []);
}
