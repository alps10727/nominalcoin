
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoadingScreen from "../dashboard/LoadingScreen";
import { debugLog } from "@/utils/debugUtils";

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
        toast.success("İnternet bağlantısı yeniden kuruldu");
        setTimeout(() => window.location.reload(), 2000);
      }
    };
    
    const handleOffline = () => {
      debugLog("AppInitializer", "İnternet bağlantısı kesildi");
      setIsOffline(true);
      setReconnecting(true);
      
      toast.error("İnternet bağlantınız kesildi. Çevrimdışı modda çalışıyorsunuz.");
      
      // 30 saniye sonra yeniden bağlanmayı dene
      reconnectTimer = setTimeout(() => {
        if (!navigator.onLine) {
          debugLog("AppInitializer", "30 saniye geçti, sayfa yenileniyor");
          window.location.reload();
        }
      }, 30000);
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
    }, 200);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
      clearTimeout(reconnectTimer);
    };
  }, [reconnecting]);
  
  if (isOffline) {
    return <LoadingScreen forceOffline={true} message="İnternet bağlantısı bulunamadı" />;
  }
  
  if (!ready) {
    return <LoadingScreen message="Uygulama başlatılıyor..." />;
  }
  
  return <>{children}</>;
};

export default AppInitializer;
