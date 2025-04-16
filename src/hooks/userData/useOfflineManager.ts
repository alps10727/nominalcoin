
import { useState, useEffect } from "react";
import { debugLog } from "@/utils/debugUtils";

export function useOfflineManager() {
  const [networkAvailable, setNetworkAvailable] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setNetworkAvailable(true);
    const handleOffline = () => setNetworkAvailable(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { networkAvailable };
}
