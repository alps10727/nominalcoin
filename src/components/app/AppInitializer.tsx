
import { useState, useEffect } from "react";
import LoadingScreen from "../dashboard/LoadingScreen";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // App initialization
    const startTime = performance.now();
    
    // Reduced delay before showing UI
    const timer = setTimeout(() => {
      setReady(true);
    }, 50);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
      
      // Log performance metrics
      const loadTime = performance.now() - startTime;
      console.log(`Uygulama yükleme süresi: ${loadTime.toFixed(0)}ms`);
    };
  }, []);
  
  if (isOffline) {
    return <LoadingScreen forceOffline={true} message="İnternet bağlantısı bulunamadı" />;
  }
  
  if (!ready) {
    return <LoadingScreen message="Uygulama başlatılıyor..." />;
  }
  
  return <>{children}</>;
};

export default AppInitializer;
