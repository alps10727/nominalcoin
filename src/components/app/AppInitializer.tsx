
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoadingScreen from "../dashboard/LoadingScreen";
import { debugLog } from "@/utils/debugUtils";
import OfflineIndicator from "../dashboard/OfflineIndicator";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [ready, setReady] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  useEffect(() => {
    console.log("AppInitializer başlatılıyor...");
    let reconnectTimer: NodeJS.Timeout;
    
    const handleOnline = () => {
      debugLog("AppInitializer", "İnternet bağlantısı kuruldu");
      setIsOffline(false);
      
      // Yeniden bağlanma durumunda toast göster ve kurtarma mekanizması başlat
      if (reconnecting) {
        toast.success("İnternet bağlantısı yeniden kuruldu.");
      }
    };
    
    const handleOffline = () => {
      debugLog("AppInitializer", "İnternet bağlantısı kesildi");
      setIsOffline(true);
      setReconnecting(true);
      
      toast.warning("İnternet bağlantınız kesildi. Çevrimdışı modda çalışmaya devam edilecek.", {
        duration: 5000
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Uygulama ilk yükleme
    const initializeApp = () => {
      try {
        const startTime = performance.now();
        
        // İlk yükleme
        if (!initialLoadAttempted || loadAttempt < 3) {
          setInitialLoadAttempted(true);
          
          // Uygulamayı kademeli olarak başlatma işlemi
          const loadTimer = setTimeout(() => {
            setReady(true);
            const loadTime = performance.now() - startTime;
            debugLog("AppInitializer", `Uygulama ${loadTime.toFixed(0)}ms içinde başlatıldı`);
          }, 1000); // Daha hızlı başlatma
          
          return () => {
            clearTimeout(loadTimer);
          };
        }
      } catch (error) {
        console.error("Uygulama başlatma hatası:", error);
        // Hata durumunda yine de uygulamayı başlatmaya çalış
        setReady(true);
      }
    };
    
    initializeApp();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(reconnectTimer);
    };
  }, [reconnecting, initialLoadAttempted, loadAttempt, isOffline]);
  
  // Yükleme başarısız olursa tekrar dene - maksimum 3 deneme
  useEffect(() => {
    if (initialLoadAttempted && !ready && loadAttempt < 3) {
      const retryTimer = setTimeout(() => {
        debugLog("AppInitializer", `Yükleme denemesi ${loadAttempt + 1}/3 başlatılıyor...`);
        setLoadAttempt(prev => prev + 1);
      }, 3000); // Daha kısa sürede tekrar dene
      
      return () => {
        clearTimeout(retryTimer);
      };
    }
  }, [initialLoadAttempted, ready, loadAttempt]);
  
  console.log("AppInitializer durumu:", { ready, isOffline, loadAttempt });

  if (!ready) {
    return <LoadingScreen message="Uygulama başlatılıyor..." forceOffline={isOffline} />;
  }
  
  return (
    <>
      {children}
      <OfflineIndicator isOffline={isOffline} />
    </>
  );
};

export default AppInitializer;
