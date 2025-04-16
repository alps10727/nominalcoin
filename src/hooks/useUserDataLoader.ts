
import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { handleFirebaseConnectionError } from "@/utils/firebaseErrorHandler";
import { QueryCacheManager } from "@/services/db";
import { UserData, saveUserData, clearUserData } from "@/utils/storage";
import { useLocalDataLoader } from "@/hooks/user/useLocalDataLoader";
import { useFirebaseDataLoader } from "@/hooks/user/useFirebaseDataLoader";
import { useUserDataValidator } from "@/hooks/user/useUserDataValidator";

export interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  dataSource: 'firebase' | 'cache' | 'local' | null;
}

/**
 * Milyonlarca kullanıcı için optimize edilmiş veri yükleme kancası
 */
export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'firebase' | 'cache' | 'local' | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string | null>(null);
  const [networkAvailable, setNetworkAvailable] = useState(navigator.onLine);

  const { loadLocalUserData, createDefaultUserData, ensureUserData } = useLocalDataLoader();
  const { loadFirebaseUserData, mergeUserData } = useFirebaseDataLoader();
  const { ensureValidUserData } = useUserDataValidator();

  // Ağ değişiklikleri izle
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

  // Kullanıcı verilerini yükleyen ana fonksiyon
  const loadUserData = useCallback(async () => {
    if (!authInitialized) return;
    
    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      setDataSource(null);
      return;
    }

    // Kullanıcı değiştiğinde verileri temizle
    if (lastLoadedUserId && lastLoadedUserId !== currentUser.uid) {
      debugLog("useUserDataLoader", "Kullanıcı değişti, veriler temizleniyor", 
        { lastUser: lastLoadedUserId, newUser: currentUser.uid });
      clearUserData();
      QueryCacheManager.invalidate(new RegExp(`^userData_${lastLoadedUserId}`));
      setUserData(null);
    }
    
    // Güncel kullanıcı ID'sini kaydet
    setLastLoadedUserId(currentUser.uid);

    try {
      // Mevcut kullanıcının yerel verilerini yükle
      let localData = loadLocalUserData();
      
      // Farklı kullanıcı kontrolü
      if (localData && localData.userId && localData.userId !== currentUser.uid) {
        debugLog("useUserDataLoader", "Farklı kullanıcıya ait yerel veri temizleniyor", 
          { storedId: localData.userId, currentId: currentUser.uid });
        clearUserData();
        localData = null;
      }
      
      // Gerekli alanları kontrol et ve eksik alanları doldur
      localData = ensureUserData(localData, currentUser.uid);
      
      if (localData) {
        // Geçici olarak yerel veriyi kullan (hız için)
        setUserData(localData);
        setDataSource('local');
        debugLog("useUserDataLoader", "Yerel depodan veriler yüklendi:", localData);
      }
      
      // İnternet bağlantısı varsa Firebase'den veri yükleme dene
      if (networkAvailable) {
        try {
          // Firebase'den verileri yüklemeyi dene
          const { data: firebaseData, source } = await loadFirebaseUserData(currentUser.uid);
          
          if ((source === 'firebase' || source === 'cache') && firebaseData) {
            debugLog("useUserDataLoader", `Veriler ${source} kaynağından yüklendi:`, firebaseData);
            
            // Yerel ve Firebase verilerini karşılaştır ve akıllı birleştirme yap
            const mergedData = mergeUserData(localData, firebaseData);
            const validatedData = ensureValidUserData(mergedData, currentUser.uid);
            
            setUserData(validatedData);
            setDataSource(source);
            saveUserData(validatedData, currentUser.uid);
          } else if (source === 'timeout' && !localData) {
            // Firebase'e erişilemedi ve yerel veri de yoksa, yeni veri oluştur
            const emptyData = createDefaultUserData(currentUser.uid);
            setUserData(emptyData);
            saveUserData(emptyData, currentUser.uid);
            setDataSource('local');
            
            toast.warning("Kullanıcı verileriniz bulunamadı. Yeni profil oluşturuldu.");
          }
        } catch (error) {
          handleFirebaseConnectionError(error, "useUserDataLoader");
          
          if (!localData) {
            const emptyData = createDefaultUserData(currentUser.uid);
            setUserData(emptyData);
            saveUserData(emptyData, currentUser.uid);
            setDataSource('local');
          } else {
            // Yerel veriler kullanılıyor
            setDataSource('local');
          }
        }
      } else {
        // İnternet bağlantısı yoksa sadece yerel veriyi kullan
        debugLog("useUserDataLoader", "İnternet bağlantısı yok, yerel veriler kullanılıyor");
        
        if (!localData) {
          const emptyData = createDefaultUserData(currentUser.uid);
          setUserData(emptyData);
          saveUserData(emptyData, currentUser.uid);
        }
        setDataSource('local');
      }
      
      setLoading(false);
    } catch (error) {
      errorLog("useUserDataLoader", "Kullanıcı verileri yüklenirken kritik hata:", error);
      
      const emptyData = createDefaultUserData(currentUser?.uid);
      
      setUserData(emptyData);
      saveUserData(emptyData, currentUser?.uid);
      setDataSource('local');
      setLoading(false);
      
      toast.error("Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      setErrorOccurred(true);
    }
  }, [currentUser, authInitialized, errorOccurred, loadAttempt, lastLoadedUserId, networkAvailable]);

  // Yükleme işlemini başlat
  useEffect(() => {
    let isActive = true;
    
    const initializeData = async () => {
      await loadUserData();
      if (!isActive) return;
    };
    
    initializeData();
    
    // Ağ durumu değiştiğinde veriyi yeniden yükle
    const handleNetworkChange = () => {
      if (networkAvailable && currentUser) {
        debugLog("useUserDataLoader", "Ağ bağlantısı değişti, veriler yeniden yükleniyor");
        loadUserData();
      }
    };
    
    window.addEventListener('online', handleNetworkChange);
    
    // Periyodik yeniden doğrulama (5 dakikada bir)
    const refreshInterval = setInterval(() => {
      if (currentUser && networkAvailable) {
        // Sadece önbelleği güncelleyerek sunucu verilerini kontrol et
        loadFirebaseUserData(currentUser.uid)
          .then(({ data, source }) => {
            if (data && (source === 'firebase' || source === 'cache')) {
              // Sunucudaki veri yerel veriden daha yüksek bakiye içeriyorsa güncelle
              setUserData(current => {
                if (!current) return data;
                
                if (data.balance > current.balance) {
                  debugLog("useUserDataLoader", "Sunucudan daha yüksek bakiye tespit edildi, güncelleniyor", {
                    currentBalance: current.balance,
                    serverBalance: data.balance
                  });
                  
                  const updatedData = {
                    ...current,
                    balance: data.balance
                  };
                  
                  saveUserData(updatedData, currentUser.uid);
                  return updatedData;
                }
                
                return current;
              });
            }
          });
      }
    }, 300000); // 5 dakika
    
    return () => {
      isActive = false;
      clearInterval(refreshInterval);
      window.removeEventListener('online', handleNetworkChange);
    };
  }, [loadUserData, currentUser, networkAvailable]);

  return { userData, loading, dataSource };
}
