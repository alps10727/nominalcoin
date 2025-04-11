
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
  const [loadingError, setLoadingError] = useState<Error | null>(null);
  
  // Global hata yakalayıcı
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Kritik uygulama hatası:", event.error);
      setLoadingError(event.error);
      
      // Sayfayı otomatik yenileme - daha verimli hale getirildi
      window.location.reload();
    };
    
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);
  
  useEffect(() => {
    console.log("AppInitializer başlatılıyor...");
    
    const handleOnline = () => {
      debugLog("AppInitializer", "İnternet bağlantısı kuruldu");
      setIsOffline(false);
      
      // Yeniden bağlanma durumunda toast göster
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
    
    // Uygulama ilk yükleme - gereksiz bekleme kaldırıldı
    const initializeApp = () => {
      try {
        const startTime = performance.now();
        
        // İlk yükleme - gereksiz setTimeout kaldırıldı
        if (!initialLoadAttempted || loadAttempt < 3) {
          setInitialLoadAttempted(true);
          setReady(true);
          const loadTime = performance.now() - startTime;
          debugLog("AppInitializer", `Uygulama ${loadTime.toFixed(0)}ms içinde başlatıldı`);
        }
      } catch (error) {
        console.error("Uygulama başlatma hatası:", error);
        // Hatayı kaydet ama yine de uygulamayı başlatmaya çalış
        setReady(true);
      }
    };
    
    initializeApp();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [reconnecting, initialLoadAttempted, loadAttempt, isOffline]);
  
  // Yükleme başarısız olursa hızlıca tekrar dene - gereksiz bekleme kaldırıldı
  useEffect(() => {
    if (initialLoadAttempted && !ready && loadAttempt < 3) {
      debugLog("AppInitializer", `Yükleme denemesi ${loadAttempt + 1}/3 başlatılıyor...`);
      setLoadAttempt(prev => prev + 1);
    }
  }, [initialLoadAttempted, ready, loadAttempt]);
  
  // Hata durumunda
  if (loadingError) {
    return (
      <LoadingScreen 
        message="Bir hata oluştu, sayfa yeniden yükleniyor..." 
        forceOffline={isOffline} 
      />
    );
  }
  
  // Yükleme ekranı - gereksiz bekleme kaldırıldı
  if (!ready) {
    return (
      <LoadingScreen 
        message={loadAttempt > 0 ? "Yükleme yeniden deneniyor..." : "Uygulama başlatılıyor..."} 
        forceOffline={isOffline} 
      />
    );
  }
  
  return (
    <>
      {children}
      <OfflineIndicator isOffline={isOffline} />
    </>
  );
};

export default AppInitializer;
