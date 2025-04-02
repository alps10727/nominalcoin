
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";

export interface AuthState {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'firebase' | 'local' | null;
}

export function useAuthState(): AuthState {
  // Kimlik doğrulama gözlemcisi hook'unu kullan
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Kullanıcı verisi yükleyici hook'unu kullan
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Bileşik yükleme durumu
  const loading = authLoading || dataLoading;
  
  // Çevrimdışı durumu belirle
  const isOffline = !navigator.onLine || dataSource === 'local';

  return { 
    currentUser, 
    userData, 
    loading,
    isOffline,
    dataSource
  };
}

// Eksik importu düzelt
import { User } from "firebase/auth";
