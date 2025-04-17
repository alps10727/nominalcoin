
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
 * 
 * Özellikleri:
 * - İleri düzey önbelleğe alma
 * - Otomatik yeniden deneme
 * - Hata izolasyonu
 * - Akıllı senkronizasyon
 * - Şüpheli veri algılama
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

  const { loadLocalUserData, ensureReferralData, createDefaultUserData } = useLocalDataLoader();
  const { loadFirebaseUserData, mergeUserData } = useFirebaseDataLoader();
  const { ensureValidUserData } = useUserDataValidator();

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
      
      // Referans kodunu kontrol et ve gerekirse oluştur
      localData = ensureReferralData(localData, currentUser.uid);
      
      if (localData) {
        // Geçici olarak yerel veriyi kullan (hız için)
        setUserData(localData);
        setDataSource('local');
        debugLog("useUserDataLoader", "Yerel depodan veriler yüklendi:", localData);
      }
      
      try {
        // Firebase'den verileri yüklemeyi dene
        const { data: firebaseData, source } = await loadFirebaseUserData(currentUser.uid);
        
        if (source === 'firebase' || source === 'cache') {
          debugLog("useUserDataLoader", `Veriler ${source} kaynağından yüklendi:`, firebaseData);
          
          if (firebaseData) {
            // Yerel ve Firebase verilerini karşılaştır ve akıllı birleştirme yap
            // Bu işlem, manipüle edilmiş localStorage verilerini tespit edecek
            const mergedData = mergeUserData(localData, firebaseData);
            const validatedData = ensureValidUserData(mergedData, currentUser.uid);
            
            // Firebase ve yerel depo arasında uyuşmazlık varsa bildirim göster
            if (localData && Math.abs(localData.balance - firebaseData.balance) > 0.1) {
              if (localData.balance > firebaseData.balance * 1.2) { // %20'den fazla fark varsa şüpheli
                toast.warning("Hesap bakiyesinde tutarsızlık tespit edildi. Doğru değer kullanılıyor.");
                debugLog("useUserDataLoader", "Şüpheli bakiye farkı tespit edildi", 
                  { local: localData.balance, server: firebaseData.balance });
              }
            }
            
            setUserData(validatedData);
            setDataSource(source);
            saveUserData(validatedData, currentUser.uid);
          }
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
        }
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
    }
  }, [currentUser, authInitialized, errorOccurred, loadAttempt, lastLoadedUserId]);

  // Yükleme işlemini başlat
  useEffect(() => {
    let isActive = true;
    
    const initializeData = async () => {
      await loadUserData();
      if (!isActive) return;
    };
    
    initializeData();
    
    // Periyodik yeniden doğrulama (5 dakikada bir)
    const refreshInterval = setInterval(() => {
      if (currentUser) {
        // Sadece önbelleği güncelleyerek sunucu verilerini kontrol et
        // Bu UI'ı dondurmadan arka planda gerçekleşir
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
    };
  }, [loadUserData, currentUser]);

  return { userData, loading, dataSource };
}
