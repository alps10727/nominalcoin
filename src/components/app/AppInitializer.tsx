
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoadingScreen from "../dashboard/LoadingScreen";
import { debugLog } from "@/utils/debugUtils";
import OfflineIndicator from "../dashboard/OfflineIndicator";
import { loadUserData } from "@/utils/storage";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  // Mining timer recovery check
  useEffect(() => {
    if (ready) {
      try {
        const localData = loadUserData();
        
        // Check for active mining with end time in the future
        if (localData && localData.miningActive && localData.miningEndTime) {
          const now = Date.now();
          
          if (localData.miningEndTime > now) {
            // Mining is still active
            const remainingTimeMinutes = Math.floor((localData.miningEndTime - now) / 60000);
            
            // Notify only if significant time remains (more than 1 minute)
            if (remainingTimeMinutes > 1) {
              toast.info(t("mining.stillActive"), {
                description: t("mining.remainingTime", remainingTimeMinutes.toString()),
                duration: 4000
              });
              debugLog("AppInitializer", `Recovered active mining: ${remainingTimeMinutes} minutes remaining`);
            }
          } else if (localData.miningActive) {
            // Mining period completed during downtime
            toast.success(t("mining.completed"), {
              description: t("mining.completedWhileAway"),
              duration: 4000
            });
            debugLog("AppInitializer", "Mining period completed while app was closed");
          }
        }
      } catch (error) {
        console.error("Mining recovery check error:", error);
      }
    }
  }, [ready, t]);
  
  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Critical application error:", event.error);
      setLoadingError(event.error);
      
      // Auto-refresh page - more efficient
      window.location.reload();
    };
    
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);
  
  useEffect(() => {
    console.log("AppInitializer starting...");
    
    const handleOnline = () => {
      debugLog("AppInitializer", "Internet connection established");
      setIsOffline(false);
      
      // Show toast on reconnection
      if (reconnecting) {
        toast.success(t("connection.restored"));
      }
    };
    
    const handleOffline = () => {
      debugLog("AppInitializer", "Internet connection lost");
      setIsOffline(true);
      setReconnecting(true);
      
      toast.warning(t("connection.lost"), {
        duration: 5000
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // App initial load - unnecessary waiting removed
    const initializeApp = () => {
      try {
        const startTime = performance.now();
        
        // Initial load - unnecessary setTimeout removed
        if (!initialLoadAttempted || loadAttempt < 3) {
          setInitialLoadAttempted(true);
          setReady(true);
          const loadTime = performance.now() - startTime;
          debugLog("AppInitializer", `App initialized in ${loadTime.toFixed(0)}ms`);
        }
      } catch (error) {
        console.error("App initialization error:", error);
        // Log the error but still try to start the app
        setReady(true);
      }
    };
    
    initializeApp();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [reconnecting, initialLoadAttempted, loadAttempt, isOffline, t]);
  
  // Quickly retry if loading fails - unnecessary waiting removed
  useEffect(() => {
    if (initialLoadAttempted && !ready && loadAttempt < 3) {
      debugLog("AppInitializer", `Loading attempt ${loadAttempt + 1}/3 starting...`);
      setLoadAttempt(prev => prev + 1);
    }
  }, [initialLoadAttempted, ready, loadAttempt]);
  
  // Error state
  if (loadingError) {
    return (
      <LoadingScreen 
        message={t("errors.reloading")} 
        forceOffline={isOffline} 
      />
    );
  }
  
  // Loading screen - unnecessary waiting removed
  if (!ready) {
    return (
      <LoadingScreen 
        message={loadAttempt > 0 ? t("app.retryingLoad") : t("app.starting")} 
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
