
import { useAuthObserver } from "./useAuthObserver";
import { useUserDataLoader } from "./useUserDataLoader";
import { UserData } from "@/utils/storage";
import { useEffect, useState } from "react";

export interface AuthState {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'firebase' | 'local' | null;
}

/**
 * Firebase ve yerel depolama entegrasyonuyla yetkilendirme durumu kancası
 */
export function useAuthState(): AuthState {
  // Yetkilendirme gözlemcisi kancasını kullan
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Kullanıcı veri yükleyici kancasını kullan (Firebase öncelikli)
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Firebase ve yerel veri yükleme durumlarını birleştir
  const loading = authLoading || dataLoading;
  
  // Çevrimdışı durumu izle (kullanıcı verisi yerel depodan geldiyse)
  const isOffline = dataSource === 'local';

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
