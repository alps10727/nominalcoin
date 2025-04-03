
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
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let userDataTimeoutId: NodeJS.Timeout;
    let isActive = true; // Belleği sızıntısı önleyici

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
        // Önce local veriye bakalım - hızlı yanıt için kritik
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Yerel depodan kullanıcı verileri yüklendi:", localData);
          
          // Daha hızlı yükleme için loading durumunu hemen sonlandır
          setLoading(false);
        }
        
        // Hatanın bir kez bildirildiğinden emin ol
        if (errorOccurred) {
          setLoading(false);
          return;
        }
        
        // Retry mekanizması ile Firebase'den taze veri almaya çalış
        const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
          try {
            // Veri çekme işlemi için daha kısa timeout süresi - 10 saniye
            const timeoutPromise = new Promise((_, reject) => {
              userDataTimeoutId = setTimeout(() => {
                reject(new Error("Firebase veri yükleme zaman aşımı"));
              }, 10000);
            });
            
            // Veri çekme işlemi
            const dataPromise = loadUserDataFromFirebase(currentUser.uid);
            
            // İki promise'i yarıştır - hangisi önce biterse
            const data = await Promise.race([dataPromise, timeoutPromise]);
            clearTimeout(userDataTimeoutId);
            return data;
          } catch (error) {
            clearTimeout(userDataTimeoutId);
            if (retryAttempt < 1 && ((error as any)?.code === 'unavailable' || (error as Error).message.includes('zaman aşımı'))) {
              debugLog("useUserDataLoader", `Firebase veri yükleme denemesi başarısız (${retryAttempt + 1}/2), yeniden deneniyor...`);
              // Gecikme süresi
              return new Promise(resolve => setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 2000));
            }
            throw error;
          }
        };
        
        try {
          // LocalData varsa, Firebase verilerini arka planda yükle - kullanıcıyı bekletme
          if (localData) {
            loadUserDataWithRetry()
              .then(userDataFromFirebase => {
                if (!isActive) return; // Component unmount olduysa işlemi durdur
                
                if (userDataFromFirebase) {
                  // Firebase verisinde daha yüksek bakiye yoksa yerel verileri kullan
                  if (localData.balance >= userDataFromFirebase.balance) {
                    debugLog("useUserDataLoader", "Yerel veri Firebase'den daha güncel, değişiklik yapılmadı");
                  } else {
                    // Firebase verisi daha güncel, kullan
                    setUserData(userDataFromFirebase);
                    setDataSource('firebase');
                    // Yerel depoya kaydet
                    saveUserData(userDataFromFirebase);
                    debugLog("useUserDataLoader", "Firebase verisi daha güncel, güncellendi");
                  }
                }
              })
              .catch(err => {
                // Firebase hatası sessizce geç - yerel veriyi kullanıyoruz zaten
                debugLog("useUserDataLoader", "Firebase güncelleme hatası (arka planda): " + err.message);
              });
          }
          // Yerel veri yoksa, Firebase verisi için bekle
          else {
            const userDataFromFirebase = await loadUserDataWithRetry();
            
            if (userDataFromFirebase) {
              setUserData(userDataFromFirebase);
              setDataSource('firebase');
              
              // Yerel depoya da kaydet
              saveUserData(userDataFromFirebase);
              debugLog("useUserDataLoader", "Firebase'den kullanıcı verileri yüklendi ve yerel depoya kaydedildi");
            }
            
            if (!isActive) return; // Component unmount olduysa işlemi durdur
            setLoading(false);
          }
        } catch (firebaseError) {
          // Firebase hatası durumunda, yerel veriyi kullanmaya devam et
          errorLog("useUserDataLoader", "Firebase'den veri yükleme hatası:", firebaseError);
          setErrorOccurred(true);
          
          if (!localData && loadAttempt < 2) {
            // Yerel veri yoksa ve ilk denemeyse, yeniden dene
            setLoadAttempt(prev => prev + 1);
            debugLog("useUserDataLoader", `Veri yükleme başarısız, yeniden deneniyor (${loadAttempt + 1}/3)`);
            setTimeout(loadData, 2000);
            return;
          }
          
          if (localData) {
            debugLog("useUserDataLoader", "Firebase'e erişim hatası, yerel veri kullanılıyor");
          } else {
            // En son çare - yeni kullanıcı profili oluştur
            const newUserData = {
              balance: 0,
              miningRate: 0.1,
              lastSaved: Date.now(),
              miningActive: false,
              userId: currentUser.uid
            };
            
            setUserData(newUserData);
            saveUserData(newUserData);
            debugLog("useUserDataLoader", "Veri bulunamadı, yeni kullanıcı profili oluşturuldu");
          }
          
          if (!isActive) return; // Component unmount olduysa işlemi durdur
          setLoading(false);
        }
      } catch (error) {
        errorLog("useUserDataLoader", "Kullanıcı verisi yükleme hatası:", error);
        setErrorOccurred(true);
        
        // Son çare olarak ya boş kullanıcı profili ya da yerel veri
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          setDataSource('local');
        } else {
          // Boş kullanıcı profili
          const newUserData = {
            balance: 0,
            miningRate: 0.1,
            lastSaved: Date.now(),
            miningActive: false,
            userId: currentUser?.uid
          };
          setUserData(newUserData);
          saveUserData(newUserData);
        }
        
        if (!isActive) return; // Component unmount olduysa işlemi durdur
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isActive = false; // Component unmount olduğunda işaretleme
      clearTimeout(userDataTimeoutId);
    };
  }, [currentUser, authInitialized, errorOccurred, loadAttempt]);

  return { userData, loading, dataSource };
}
