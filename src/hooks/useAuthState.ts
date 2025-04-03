
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

/**
 * Tamamen yerel depolamaya dayalı yetkilendirme durumu kancası
 * Firebase'e hiç bağlanmadan çalışır
 */
export function useAuthState(): AuthState {
  // Yerel depolamadan kullanıcı verilerini doğrudan başlatma
  const [initialLocalData] = useState(() => loadUserData());
  
  // Yetkilendirme gözlemcisi kancasını kullan (gerekli ama sonuçları kullanma)
  const { currentUser, loading: authLoading, authInitialized } = useAuthObserver();
  
  // Yerel depolama öncelikli kullanıcı veri yükleyici kancasını kullan
  const { userData, loading: dataLoading, dataSource } = useUserDataLoader(currentUser, authInitialized);
  
  // Yerel veriye öncelik ver ve Firebase için ASLA bekleme
  const loading = false; // Yükleme durumunu asla gösterme
  
  // Her zaman çevrimdışı modu varsay - bu Firebase müdahalesini önler
  const isOffline = true;

  return { 
    currentUser, 
    userData: initialLocalData || userData, // KRİTİK: Her zaman yerel veriye öncelik ver
    loading: false, // Yükleme durumunu her zaman false olarak ayarla (beyaz ekranı önlemek için)
    isOffline: true, // Kararlılık için çevrimdışı modu zorla
    dataSource: 'local' // Her zaman yerel kaynağı kullan
  };
}

// Firebase User tipini içe aktar
import { User } from "firebase/auth";
