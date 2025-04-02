
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userService";
import { loadUserData, saveUserData } from "@/utils/storage";
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
    debugLog("useAuthState", "Authentication state initializing...");
    let authTimeoutId: NodeJS.Timeout;
    let userDataTimeoutId: NodeJS.Timeout;
    
    // Set timeout for Firebase auth
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthState", "Firebase Auth timed out, trying to load local data");
        
        try {
          const localUserData = loadUserData();
          if (localUserData) {
            setUserData(localUserData);
            debugLog("useAuthState", "Loaded user data from local storage (offline mode)");
            toast.warning("Firebase'e bağlanılamadı. Çevrimdışı modda çalışılıyor.");
          }
        } catch (e) {
          errorLog("useAuthState", "Error loading from local storage:", e);
        } finally {
          setLoading(false);
          setCurrentUser(null);
          setAuthInitialized(true);
        }
      }
    }, 7000); // 5 saniyeden 7 saniyeye çıkarıldı

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      debugLog("useAuthState", "Auth state changed:", user ? user.email : 'No user');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        try {
          // First try loading from local storage for faster UI response
          const localData = loadUserData();
          if (localData) {
            setUserData(localData);
            debugLog("useAuthState", "Loaded user data from local storage:", localData);
          }
          
          // Try getting fresh data from Firebase with retry logic
          const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
            try {
              userDataTimeoutId = setTimeout(() => {
                throw new Error("Firebase data loading timed out");
              }, 10000); // 5 saniyeden 10 saniyeye çıkarıldı
              
              const data = await loadUserDataFromFirebase(user.uid);
              clearTimeout(userDataTimeoutId);
              return data;
            } catch (error) {
              clearTimeout(userDataTimeoutId);
              if (retryAttempt < 2 && ((error as any)?.code === 'unavailable' || (error as Error).message.includes('timeout'))) {
                debugLog("useAuthState", `Firebase data load attempt failed (${retryAttempt + 1}/3), retrying...`);
                return new Promise(resolve => setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 1000));
              }
              throw error;
            }
          };
          
          const userDataFromFirebase = await loadUserDataWithRetry();
          
          // Firebase'den veri geldiyse ve yerel veriden daha küçük bakiye varsa, iki veriyi karşılaştır
          if (userDataFromFirebase && localData) {
            if (localData.balance > userDataFromFirebase.balance) {
              // Yerel veri daha güncel, Firebase'e yerel veriyi kaydet
              debugLog("useAuthState", "Yerel veri Firebase'den daha güncel, yerel veriyi kullanıyoruz");
              setUserData(localData);
              
              // Firestore'a da güncel veriyi kaydet
              try {
                const { saveUserDataToFirebase } = await import('@/services/userService');
                await saveUserDataToFirebase(user.uid, localData);
                debugLog("useAuthState", "Güncel veriler Firebase'e kaydedildi");
              } catch (err) {
                errorLog("useAuthState", "Firebase'e güncel veri kaydetme hatası:", err);
              }
            } else {
              // Firebase verisi güncel veya eşit
              setUserData(userDataFromFirebase);
              debugLog("useAuthState", "Firebase'den güncel veri yüklendi");
              
              // Yerel depoya da Firebase verisini kaydet
              saveUserData(userDataFromFirebase);
            }
          } else if (userDataFromFirebase) {
            // Sadece Firebase verisi varsa
            setUserData(userDataFromFirebase);
            debugLog("useAuthState", "Loaded fresh user data from Firebase");
            
            // Yerel depoya da Firebase verisini kaydet
            saveUserData(userDataFromFirebase);
          } else if (localData) {
            // Sadece yerel veri varsa
            setUserData(localData);
            debugLog("useAuthState", "Using local data as Firebase data is not available");
            toast.warning("Sunucu verilerine erişilemedi. Yerel veriler kullanılıyor.");
          }
        } catch (error) {
          errorLog("useAuthState", "Error loading user data:", error);
          
          // Fall back to local data if any
          const localData = loadUserData();
          if (localData) {
            debugLog("useAuthState", "Offline mode: Using user data from local storage");
            setUserData(localData);
            toast.warning("Could not access server data. Using offline data.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Çıkış yapıldığında userData'yı null olarak ayarla, ama localStorage'dan silme
        // Bu sayede tekrar giriş yapıldığında eski veriler kullanılabilir
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
