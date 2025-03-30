
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userService";
import { loadUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export interface AuthState {
  currentUser: User | null;
  userData: any | null;
  loading: boolean;
}

export function useAuthState(): AuthState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    debugLog("useAuthState", "Kimlik doğrulama durumu başlatılıyor...");
    let authTimeoutId: NodeJS.Timeout;
    let userDataTimeoutId: NodeJS.Timeout;
    let retryCount = 0;
    
    // Firebase auth çok uzun sürerse
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthState", "Firebase Auth zaman aşımına uğradı, kullanıcı oturumu kapalı olarak işaretleniyor");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
        
        try {
          const localUserData = loadUserData();
          if (localUserData) {
            setUserData(localUserData);
            debugLog("useAuthState", "Yerel depodan kullanıcı verileri yüklendi (çevrimdışı mod)");
          }
        } catch (e) {
          errorLog("useAuthState", "Yerel depodan veri yükleme hatası:", e);
        }
      }
    }, 5000);

    // Kimlik doğrulama durumu değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      debugLog("useAuthState", "Kimlik doğrulama durumu değişti:", user ? user.email : 'Kullanıcı yok');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        try {
          // Önce daha hızlı UI yanıtı için yerel depodan yüklemeyi dene
          const localData = loadUserData();
          if (localData) {
            setUserData(localData);
            debugLog("useAuthState", "Yerel depodan kullanıcı verileri yüklendi");
          }
          
          // Firebase'ten taze veri almayı dene
          const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
            try {
              userDataTimeoutId = setTimeout(() => {
                throw new Error("Firebase veri yükleme zaman aşımına uğradı");
              }, 5000);
              
              const data = await loadUserDataFromFirebase(user.uid);
              clearTimeout(userDataTimeoutId);
              return data;
            } catch (error) {
              clearTimeout(userDataTimeoutId);
              if (retryAttempt < 2 && ((error as any)?.code === 'unavailable' || (error as Error).message.includes('zaman aşımı'))) {
                debugLog("useAuthState", `Firebase veri yükleme denemesi başarısız (${retryAttempt + 1}/3), yeniden deneniyor...`);
                return new Promise(resolve => setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 1000));
              }
              throw error;
            }
          };
          
          const userDataFromFirebase = await loadUserDataWithRetry();
          if (userDataFromFirebase) {
            setUserData(userDataFromFirebase);
            debugLog("useAuthState", "Firebase'den taze kullanıcı verileri yüklendi");
          }
        } catch (error) {
          errorLog("useAuthState", "Kullanıcı verilerini yükleme hatası:", error);
          
          // Eğer varsa yerel veriye geri dön
          const localData = loadUserData();
          if (localData) {
            debugLog("useAuthState", "Çevrimdışı mod: Yerel depodan kullanıcı verileri kullanılıyor");
            setUserData(localData);
            toast.warning("Sunucu verilerine erişilemiyor. Çevrimdışı veriler kullanılıyor.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(authTimeoutId);
      clearTimeout(userDataTimeoutId);
      unsubscribe();
    };
  }, []);

  return { currentUser, userData, loading };
}
