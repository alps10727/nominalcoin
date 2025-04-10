
import { useEffect } from "react";
import { errorLog } from "@/utils/debugUtils";

export function usePagePreloading() {
  useEffect(() => {
    const prefetchPages = async () => {
      try {
        // Optimize preloading by using smaller chunks and handling errors individually
        const importPromises = [
          import("@/pages/Profile").catch(e => errorLog("usePagePreloading", "Failed to preload Profile:", e)),
          import("@/pages/History").catch(e => errorLog("usePagePreloading", "Failed to preload History:", e)),
          import("@/pages/Referral").catch(e => errorLog("usePagePreloading", "Failed to preload Referral:", e)),
          import("@/pages/Tasks").catch(e => errorLog("usePagePreloading", "Failed to preload Tasks:", e)),
          import("@/pages/MiningUpgrades").catch(e => errorLog("usePagePreloading", "Failed to preload MiningUpgrades:", e)),
          import("@/components/MobileNavigation").catch(e => errorLog("usePagePreloading", "Failed to preload MobileNavigation:", e))
        ];
        
        // Handle preload results individually to prevent one failure from affecting others
        const results = await Promise.allSettled(importPromises);
        const successCount = results.filter(result => result.status === 'fulfilled').length;
        console.log(`${successCount}/${importPromises.length} sayfalar başarıyla önceden yüklendi`);
      } catch (error) {
        // This catch should only trigger for errors not caught by individual promises
        errorLog("usePagePreloading", "Sayfaları önceden yükleme genel hatası:", error);
      }
    };
    
    // Use setTimeout to delay preloading and prioritize initial page render
    const timer = setTimeout(() => {
      prefetchPages();
    }, 1000); // 1-second delay for initial render to complete
    
    return () => clearTimeout(timer);
  }, []);
}
