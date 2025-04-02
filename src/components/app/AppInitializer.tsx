
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
  
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    
    const handleOnline = () => {
      debugLog("AppInitializer", "İnternet bağlantısı kuruldu");
      setIsOffline(false);
      
      // Yeniden bağlanma durumunda toast göster ve sayfayı yenile
      if (reconnecting) {
        toast.success("İnternet bağlantısı yeniden kuruldu. Veriler senkronize ediliyor...");
        setTimeout(() => window.location.reload(), 2000);
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
    
    // App initialization
    const startTime = performance.now();
    
    // Uygulamayı kademeli olarak başlat
    const timer = setTimeout(() => {
      setReady(true);
      const loadTime = performance.now() - startTime;
      debugLog("AppInitializer", `Uygulama ${loadTime.toFixed(0)}ms içinde başlatıldı`);
    }, 500);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
      clearTimeout(reconnectTimer);
    };
  }, [reconnecting]);
  
  if (!ready) {
    return <LoadingScreen message="Uygulama başlatılıyor..." forceOffline={isOffline} />;
  }
  
  return (
    <>
      {children}
      <OfflineIndicator />
    </>
  );
};

export default AppInitializer;
