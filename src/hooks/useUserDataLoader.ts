
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
    let firebaseFetchCancelled = false; // Yeni bir değişken ekledik

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
        // IMMEDIATELY check for local data - for instant response
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Yerel depodan kullanıcı verileri yüklendi:", localData);
          
          // IMMEDIATELY end loading state when we have local data
          setLoading(false);
          
          // Set a very short timeout before we even try Firebase
          // This ensures the app loads quickly with local data
          setTimeout(() => {
            if (!isActive || firebaseFetchCancelled) return;
            
            // Try Firebase in background only - don't block UI
            loadUserDataWithRetry()
              .then(firebaseData => {
                if (!isActive || firebaseFetchCancelled) return;
                
                // Only use Firebase data if balance is significantly higher
                if (firebaseData && firebaseData.balance > (localData.balance + 5)) {
                  debugLog("useUserDataLoader", "Firebase data has significantly higher balance, updating");
                  setUserData(firebaseData);
                  setDataSource('firebase');
                  saveUserData(firebaseData);
                }
              })
              .catch(err => {
                // Just log Firebase errors - don't affect UX since we're using local data
                debugLog("useUserDataLoader", "Background Firebase fetch error (ignored):", err);
              });
          }, 2000); // Very short delay to prioritize UI rendering
          
          return; // IMPORTANT: Return early to prevent Firebase from blocking
        }
        
        // Only get here if NO local data exists
        
        // Timeout protection - very short (3 seconds max)
        const timeoutId = setTimeout(() => {
          if (isActive && loading) {
            debugLog("useUserDataLoader", "Firebase loading timed out, using empty user data");
            firebaseFetchCancelled = true;
            setLoading(false);
            
            // Create empty user data as fallback
            const emptyData = {
              balance: 0,
              miningRate: 0.1,
              lastSaved: Date.now(),
              miningActive: false,
              userId: currentUser?.uid
            };
            setUserData(emptyData);
            saveUserData(emptyData);
            setDataSource('local');
          }
        }, 3000);
        
        // Only try Firebase if no local data (for new users only)
        try {
          const userDataFromFirebase = await loadUserDataWithRetry();
          
          if (isActive && !firebaseFetchCancelled) {
            clearTimeout(timeoutId);
            
            if (userDataFromFirebase) {
              setUserData(userDataFromFirebase);
              setDataSource('firebase');
              
              // Save to local storage too
              saveUserData(userDataFromFirebase);
              debugLog("useUserDataLoader", "Firebase data loaded and saved locally");
            } else {
              // Create empty user data if Firebase returns nothing
              const emptyData = {
                balance: 0,
                miningRate: 0.1,
                lastSaved: Date.now(),
                miningActive: false,
                userId: currentUser?.uid
              };
              setUserData(emptyData);
              saveUserData(emptyData);
              setDataSource('local');
            }
            
            setLoading(false);
          }
        } catch (error) {
          if (isActive && !firebaseFetchCancelled) {
            clearTimeout(timeoutId);
            errorLog("useUserDataLoader", "Firebase error, falling back to empty data:", error);
            
            const emptyData = {
              balance: 0,
              miningRate: 0.1,
              lastSaved: Date.now(),
              miningActive: false,
              userId: currentUser?.uid
            };
            setUserData(emptyData);
            saveUserData(emptyData);
            setDataSource('local');
            setLoading(false);
          }
        }
      } catch (error) {
        errorLog("useUserDataLoader", "Critical error loading user data:", error);
        if (isActive) {
          // Fallback to empty user data
          const emptyData = {
            balance: 0,
            miningRate: 0.1,
            lastSaved: Date.now(),
            miningActive: false,
            userId: currentUser?.uid
          };
          setUserData(emptyData);
          saveUserData(emptyData);
          setDataSource('local');
          setLoading(false);
        }
      }
    };

    // Retry helper function for Firebase loading
    const loadUserDataWithRetry = async (retryAttempt = 0): Promise<any> => {
      try {
        // Very short timeout (3 seconds) to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          userDataTimeoutId = setTimeout(() => {
            reject(new Error("Firebase veri yükleme zaman aşımı"));
          }, 3000); // Reduced to 3 seconds
        });
        
        // Veri çekme işlemi
        const dataPromise = loadUserDataFromFirebase(currentUser.uid);
        
        // İki promise'i yarıştır - hangisi önce biterse
        const data = await Promise.race([dataPromise, timeoutPromise]);
        clearTimeout(userDataTimeoutId);
        return data;
      } catch (error) {
        clearTimeout(userDataTimeoutId);
        if (retryAttempt < 1 && !firebaseFetchCancelled && 
           ((error as any)?.code === 'unavailable' || (error as Error).message.includes('zaman aşımı'))) {
          // Only retry once, with short timeout
          return new Promise(resolve => 
            setTimeout(() => resolve(loadUserDataWithRetry(retryAttempt + 1)), 1000)
          );
        }
        throw error;
      }
    };

    loadData();

    return () => {
      isActive = false;
      firebaseFetchCancelled = true;
      clearTimeout(userDataTimeoutId);
    };
  }, [currentUser, authInitialized, errorOccurred, loadAttempt]);

  return { userData, loading, dataSource };
}
