
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";
import { UserData } from "@/utils/storage";
import { useEffect, useState } from "react";

export interface AuthState {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'firebase' | 'cache' | 'local' | null;
}

/**
 * Firebase ve yerel depolama entegrasyonuyla yetkilendirme durumu kancası
 */
export function useAuthState(): AuthState {
  // Uygulama çevrimdışı mı kontrolü
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsNetworkAvailable(true);
    const handleOffline = () => setIsNetworkAvailable(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Yetkilendirme gözlemcisi kancasını kullan
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Kullanıcı veri yükleyici kancasını kullan (Firebase öncelikli)
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Firebase ve yerel veri yükleme durumlarını birleştir
  const loading = authLoading || dataLoading;
  
  // Çevrimdışı durumu izle (kullanıcı verisi yerel depodan geldiyse veya ağ bağlantısı yoksa)
  const isOffline = dataSource === 'local' || !isNetworkAvailable;

  return { 
    currentUser, 
    userData, 
    loading,
    isOffline,
    dataSource
  };
}

// Firebase User tipini içe aktar
import { User } from "firebase/auth";
