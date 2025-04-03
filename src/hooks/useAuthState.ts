
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";
import { loadUserData } from "@/utils/storage";
import { useEffect, useState } from "react";

export interface AuthState {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'firebase' | 'local' | null;
}

export function useAuthState(): AuthState {
  // Initialize userData directly from localStorage for instant access
  const [initialLocalData] = useState(() => loadUserData());
  
  // Kimlik doğrulama gözlemcisi hook'unu kullan
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Kullanıcı verisi yükleyici hook'unu kullan (with local storage priority flag)
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Bileşik yükleme durumu - if we have local data, don't wait for Firebase
  const loading = initialLocalData ? false : (authLoading || dataLoading);
  
  // Çevrimdışı durumu belirle - navigator.onLine kontrolü öne alındı
  const isOffline = !navigator.onLine || dataSource === 'local';

  return { 
    currentUser, 
    userData: userData || initialLocalData, // Prioritize loaded data but fall back to initial local data
    loading,
    isOffline,
    dataSource: initialLocalData && !userData ? 'local' : dataSource
  };
}

// Firebase User tipini import et
import { User } from "firebase/auth";
