
import { useEffect } from "react";
import { errorLog } from "@/utils/debugUtils";

export function usePagePreloading() {
  useEffect(() => {
    const prefetchPages = async () => {
      try {
        // Tüm sayfaları önceden yükle
        const importPromises = [
          // Index is now directly imported, so don't prefetch
          import("@/pages/Profile"),
          import("@/pages/History"),
          import("@/pages/Tasks"),
          import("@/pages/MiningUpgrades"),
          import("@/components/MobileNavigation")
          // Removed SignIn and SignUp from preloading since we're importing them directly
        ];
        
        // Sayfaları paralel olarak yükle
        await Promise.all(importPromises);
        console.log("Sayfalar daha hızlı gezinme için önceden yüklendi");
      } catch (error) {
        errorLog("usePagePreloading", "Sayfaları önceden yükleme başarısız oldu:", error);
      }
    };
    
    // Hızlı erişim için ilk yükleme
    prefetchPages();
  }, []);
}
