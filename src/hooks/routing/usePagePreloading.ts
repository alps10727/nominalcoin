
import { useEffect } from "react";
import { errorLog } from "@/utils/debugUtils";

export function usePagePreloading() {
  useEffect(() => {
    const prefetchPages = async () => {
      try {
        // Tüm sayfaları önceden yükle
        const importPromises = [
          import("@/pages/Index"),
          import("@/pages/Profile"),
          import("@/pages/History"),
          import("@/pages/Referral"),
          import("@/pages/Tasks"),
          import("@/pages/MiningUpgrades"),
          import("@/components/MobileNavigation")
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
