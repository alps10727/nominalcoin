
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { loadUserData, saveUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export interface UserDataState {
  userData: any | null;
  loading: boolean;
  dataSource: 'firebase' | 'local' | null;
}

export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'firebase' | 'local' | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    let userDataTimeoutId: NodeJS.Timeout;

    const loadData = async () => {
      // Eğer kullanıcı yoksa veya auth başlatılmamışsa, veri yüklemeye çalışma
      if (!authInitialized) return;
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setDataSource(null);
        return;
      }

      try {
        // Hızlı UI yanıtı için önce yerel depodan yükle
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Yerel depodan kullanıcı verileri yüklendi:", localData);
        }
        
        // Hatanın bir kez bildirildiğinden emin ol
        if (errorOccurred) {
          setLoading(false);
          return;
        }
        
        // Retry mekanizması ile Firebase'den taze veri almaya çalış
        const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
          try {
            // Timeout süresini artırıldı - 20 saniye
            const timeoutPromise = new Promise((_, reject) => {
              userDataTimeoutId = setTimeout(() => {
                reject(new Error("Firebase veri yükleme zaman aşımı"));
              }, 20000);
            });
            
            // Veri çekme işlemi
            const dataPromise = loadUserDataFromFirebase(currentUser.uid);
            
            // İki promise'i yarıştır - hangisi önce biterse
            const data = await Promise.race([dataPromise, timeoutPromise]);
            clearTimeout(userDataTimeoutId);
            return data;
          } catch (error) {
            clearTimeout(userDataTimeoutId);
            if (retryAttempt < 2 && ((error as any)?.code === 'unavailable' || (error as Error).message.includes('zaman aşımı'))) {
              debugLog("useUserDataLoader", `Firebase veri yükleme denemesi başarısız (${retryAttempt + 1}/3), yeniden deneniyor...`);
              // Daha uzun bekleme süresi
              return new Promise(resolve => setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 3000 * (retryAttempt + 1)));
            }
            throw error;
          }
        };
        
        try {
          const userDataFromFirebase = await loadUserDataWithRetry();
          
          if (userDataFromFirebase && localData) {
            // Yerel veri ve Firebase verisi varsa, hangisini kullanacağımızı belirle
            const { compareAndResolveData } = await import('./useDataComparison');
            const resolvedData = await compareAndResolveData(currentUser.uid, localData, userDataFromFirebase);
            setUserData(resolvedData);
            setDataSource('firebase');
          } else if (userDataFromFirebase) {
            // Sadece Firebase verisi varsa
            setUserData(userDataFromFirebase);
            setDataSource('firebase');
            debugLog("useUserDataLoader", "Firebase'den taze kullanıcı verileri yüklendi");
            
            // Yerel depoya da kaydet
            saveUserData(userDataFromFirebase);
          }
        } catch (firebaseError) {
          // Firebase hatası durumunda, yerel veriyi kullanmaya devam et
          errorLog("useUserDataLoader", "Firebase'den veri yükleme hatası:", firebaseError);
          setErrorOccurred(true);
          
          if (localData) {
            debugLog("useUserDataLoader", "Firebase'e erişim hatası, yerel veri kullanılmaya devam ediliyor");
            
            // Kullanıcıyı bilgilendir
            toast.warning("Sunucu verilerine erişilemedi. Yerel veriler kullanılıyor.", {
              id: "firebase-offline-toast",
              duration: 5000
            });
          }
        }
      } catch (error) {
        errorLog("useUserDataLoader", "Kullanıcı verisi yükleme hatası:", error);
        setErrorOccurred(true);
        
        // Son çare olarak yerel veriyi dene
        const localData = loadUserData();
        if (localData) {
          debugLog("useUserDataLoader", "Çevrimdışı mod: Yerel depodan kullanıcı verileri kullanılıyor");
          setUserData(localData);
          setDataSource('local');
          toast.warning("Sunucu verilerine erişilemedi. Çevrimdışı veriler kullanılıyor.", {
            id: "firebase-offline-toast",
            duration: 5000
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      clearTimeout(userDataTimeoutId);
    };
  }, [currentUser, authInitialized, errorOccurred]);

  return { userData, loading, dataSource };
}
